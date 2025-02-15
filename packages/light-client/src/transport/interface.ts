import {ForkName} from "@lodestar/params";
import {
  LightClientBootstrap,
  LightClientFinalityUpdate,
  LightClientOptimisticUpdate,
  LightClientUpdate,
  SyncPeriod,
} from "@lodestar/types";

export interface LightClientTransport {
  getUpdates(
    startPeriod: SyncPeriod,
    count: number
  ): Promise<
    {
      version: ForkName;
      data: LightClientUpdate;
    }[]
  >;
  /**
   * Returns the latest optimistic head update available. Clients should use the SSE type `light_client_optimistic_update`
   * unless to get the very first head update after syncing, or if SSE are not supported by the server.
   */
  getOptimisticUpdate(): Promise<{version: ForkName; data: LightClientOptimisticUpdate}>;
  getFinalityUpdate(): Promise<{version: ForkName; data: LightClientFinalityUpdate}>;
  /**
   * Fetch a bootstrapping state with a proof to a trusted block root.
   * The trusted block root should be fetched with similar means to a weak subjectivity checkpoint.
   * Only block roots for checkpoints are guaranteed to be available.
   */
  getBootstrap(blockRoot: string): Promise<{version: ForkName; data: LightClientBootstrap}>;

  // registers handler for LightClientOptimisticUpdate. This can come either via sse or p2p
  onOptimisticUpdate(handler: (optimisticUpdate: LightClientOptimisticUpdate) => void): void;
  // registers handler for LightClientFinalityUpdate. This can come either via sse or p2p
  onFinalityUpdate(handler: (finalityUpdate: LightClientFinalityUpdate) => void): void;
}
