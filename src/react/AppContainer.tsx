import { Box, Grid } from "@mui/joy";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { ConnectionChecker } from "./components/connectionChecker";
import { Footer } from "./components/footer";
import { Sidebar } from "./components/sidebar";
import { AwesomeSink } from "./views/awesomeSink";
import { Drones } from "./views/drones";
import { DetailedFactoryView } from "./views/factoryView";
import { DetailedGeneratorView } from "./views/generatorView";
import { PowerMain } from "./views/powerMain";
import { FactorysSwitch } from "./views/production";
import { Settings } from "./views/settings";
import { Start } from "./views/start";
import { StorageView } from "./views/storageView";
import { Trains } from "./views/trains";
import { Vehicles } from "./views/vehicles";

export const AppContainer: React.FC = () => {
  return (
    <Grid
      container
      sx={{
        minHeight: "100dvh",
        flexDirection: { xs: "column", md: "row" },
        flexWrap: "nowrap",
      }}
    >
      <Grid
        sx={{
          width: { xs: "100%", md: "auto" },
          minWidth: { md: "50px" },
          zIndex: 10,
        }}
      >
        <Sidebar />
      </Grid>

      <Grid
        xs
        sx={{
          minWidth: 0,
          width: "100%",
        }}
      >
        <Box
          sx={{
            minHeight: "100dvh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              flex: 1,
              px: { xs: 1, sm: 2 },
              pb: { xs: 2, md: 0 },
            }}
          >
            <ConnectionChecker>
              <Routes>
                <Route path="/" element={<Start />} />
                <Route path="/power" element={<PowerMain />} />
                <Route path="/generator" element={<DetailedGeneratorView />} />
                <Route path="/production" element={<FactorysSwitch />} />
                <Route path="/factory" element={<DetailedFactoryView />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/drones" element={<Drones />} />
                <Route path="/trains" element={<Trains />} />
                <Route path="/storageView" element={<StorageView />} />
                <Route path="/awesomeSink" element={<AwesomeSink />} />
                <Route path="/settings" element={<Settings />} />
                <Route
                  path="*"
                  element={<Navigate to="/" replace />}
                />
              </Routes>
            </ConnectionChecker>
          </Box>

          <Footer />
        </Box>
      </Grid>
    </Grid>
  );
};
