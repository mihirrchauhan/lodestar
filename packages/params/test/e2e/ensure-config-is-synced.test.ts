import axios from "axios";
import {describe, expect, it, vi} from "vitest";
import {BeaconPreset, ForkName} from "../../src/index.js";
import {mainnetPreset} from "../../src/presets/mainnet.js";
import {minimalPreset} from "../../src/presets/minimal.js";
import {loadConfigYaml} from "../yaml.js";

// Not e2e, but slow. Run with e2e tests

/** https://github.com/ethereum/consensus-specs/releases */
const specConfigCommit = "v1.5.0-alpha.8";
/**
 * Fields that we filter from local config when doing comparison.
 * Ideally this should be empty as it is not spec compliant
 * For `MAX_BLOBS_PER_BLOCK`, see https://github.com/ChainSafe/lodestar/issues/7172
 */
const ignoredLocalPresetFields: (keyof BeaconPreset)[] = ["MAX_BLOBS_PER_BLOCK"];

describe("Ensure config is synced", () => {
  vi.setConfig({testTimeout: 60 * 1000});

  it("mainnet", async () => {
    const remotePreset = await downloadRemoteConfig("mainnet", specConfigCommit);
    assertCorrectPreset({...mainnetPreset}, remotePreset);
  });

  it("minimal", async () => {
    const remotePreset = await downloadRemoteConfig("minimal", specConfigCommit);
    assertCorrectPreset({...minimalPreset}, remotePreset);
  });
});

function assertCorrectPreset(localPreset: BeaconPreset, remotePreset: BeaconPreset): void {
  const filteredLocalPreset: Partial<BeaconPreset> = Object.keys(localPreset)
    .filter((key) => !ignoredLocalPresetFields.includes(key as keyof BeaconPreset))
    .reduce(
      (acc, key) => {
        acc[key as keyof BeaconPreset] = localPreset[key as keyof BeaconPreset];
        return acc;
      },
      {} as Partial<BeaconPreset>
    );

  // Check each key for better debuggability
  for (const key of Object.keys(remotePreset) as (keyof BeaconPreset)[]) {
    expect(filteredLocalPreset[key]).toBe(remotePreset[key]);
  }

  expect(filteredLocalPreset).toEqual(remotePreset);
}

async function downloadRemoteConfig(preset: "mainnet" | "minimal", commit: string): Promise<BeaconPreset> {
  const downloadedParams = await Promise.all(
    Object.values(ForkName).map((forkName) =>
      axios({
        url: `https://raw.githubusercontent.com/ethereum/consensus-specs/${commit}/presets/${preset}/${forkName}.yaml`,
        timeout: 30 * 1000,
      }).then((response) => loadConfigYaml(response.data))
    )
  );

  // Merge all the fetched yamls for the different forks
  const beaconPresetRaw: Record<string, unknown> = Object.assign(
    ...(downloadedParams as unknown as [input: Record<string, unknown>])
  );

  // As of December 2021 the presets don't include any hex strings
  const beaconPreset = {} as BeaconPreset;
  for (const key of Object.keys(beaconPresetRaw)) {
    beaconPreset[key as keyof BeaconPreset] = parseInt(beaconPresetRaw[key] as string, 10);
  }

  return beaconPreset;
}
