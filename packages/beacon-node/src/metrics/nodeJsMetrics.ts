import {gcStats} from "@chainsafe/prometheus-gc-stats";
import {Registry, collectDefaultMetrics} from "prom-client";

export function collectNodeJSMetrics(register: Registry, prefix?: string): () => void {
  collectDefaultMetrics({
    register,
    prefix,
    // eventLoopMonitoringPrecision with sampling rate in milliseconds
    eventLoopMonitoringPrecision: 10,
  });

  // Collects GC metrics using a native binding module
  // - nodejs_gc_runs_total: Counts the number of time GC is invoked
  // - nodejs_gc_pause_seconds_total: Time spent in GC in seconds
  // - nodejs_gc_reclaimed_bytes_total: The number of bytes GC has freed
  // `close` must be called to stop the gc collection process from continuing
  const close = gcStats(register, {collectionInterval: 6000, prefix});
  return close;
}
