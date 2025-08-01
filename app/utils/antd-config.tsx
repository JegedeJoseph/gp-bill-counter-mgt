import React from "react";
import { createCache, StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider, theme } from "antd";
import { ClientOnly } from "~/utils/client-only";

// Create a cache for client-side rendering
const createEmotionCache = () => createCache();

// AntDesign provider component that only renders on the client
export function AntdProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClientOnly fallback={<div className="antd-ssr-fallback">{children}</div>}>
      <AntdProviderClient>{children}</AntdProviderClient>
    </ClientOnly>
  );
}

// The actual Ant Design provider that only runs on the client
function AntdProviderClient({ children }: { children: React.ReactNode }) {
  const cache = createEmotionCache();

  return (
    <StyleProvider cache={cache}>
      <ConfigProvider
        theme={{
          algorithm: theme.defaultAlgorithm,
          token: {
            colorPrimary: "#10b981",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </StyleProvider>
  );
}
