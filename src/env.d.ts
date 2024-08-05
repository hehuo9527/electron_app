// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WS_SERVER_URL: string
  readonly VITE_HTTP_SERVER_URL: string
  readonly VITE_MQTT_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
