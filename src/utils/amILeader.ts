import axios from "axios";
import { isLocal } from "./isLocal";

/**
 * Queries the Gateway API to determine if this instance is the current leader.
 * Returns { isLeader: boolean, instanceId: string } from the gateway.
 */
export async function amILeader(): Promise<{
  isLeader: boolean;
  instanceId: string | null;
}> {
  const gatewayUrl = `http://localhost:${process.env.GATEWAY_PORT ?? "80"}`;

  if (isLocal()) {
    // Local mode — assume single instance = leader
    return {
      isLeader: true,
      instanceId: "local-instance",
    };
  }

  try {
    const { data } = await axios.get(`${gatewayUrl}/api/leader`);
    // expected response shape: { isLeader: true/false, instanceId: "..." }
    return {
      isLeader: Boolean(data.isLeader),
      instanceId: data.instanceId ?? null,
    };
  } catch (err) {
    console.error("[amILeader] Failed to contact Gateway API:", err);
    return { isLeader: false, instanceId: null };
  }
}
