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
  const gatewayUrl = isLocal()
    ? "http://localhost:3000"
    : "http://172.18.0.1:80"; // Linux Docker bridge gateway (EC2)

  if (isLocal()) {
    // Local mode — assume single instance = leader
    return { isLeader: true, instanceId: "local-instance" };
  }

  try {
    const { data } = await axios.get(`${gatewayUrl}/api/leader`, {
      timeout: 2000,
    });
    return {
      isLeader: Boolean(data.isLeader),
      instanceId: data.instanceId ?? null,
    };
  } catch (err) {
    console.error("[amILeader] Failed to contact Gateway API:", err);
    return { isLeader: false, instanceId: null };
  }
}
