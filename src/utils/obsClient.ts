import OBSWebSocket from "obs-websocket-js";

export class OBSClient {
  private obs: OBSWebSocket;
  private isConnected: boolean;

  constructor() {
    this.obs = new OBSWebSocket();
    this.isConnected = false;
  }

  async connect(
    url: string,
    password: string,
    customeRpcVersion = 1,
  ): Promise<void> {
    console.log(url);
    try {
      const { obsWebSocketVersion, negotiatedRpcVersion } =
        await this.obs.connect(url, password, {
          rpcVersion: customeRpcVersion,
        });
      console.log("111", obsWebSocketVersion);
      this.isConnected = true;
    } catch (error) {
      console.error("Failed to connect to OBS WebSocket server", error);
      this.isConnected = false;
      throw error;
    }
  }

  async getSourceScreenshot(
    sourceName: string = "显示器采集",
    imageFormat: "png" | "jpeg" = "png",
  ): Promise<{ imageData: string }> {
    return this.obs.call("GetSourceScreenshot", { sourceName, imageFormat });
  }

  async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.obs.disconnect();
        this.isConnected = false;
        console.log("Disconnected from OBS WebSocket server");
      } catch (error) {
        console.error("Failed to disconnect from OBS WebSocket server", error);
      }
    }
  }
}
