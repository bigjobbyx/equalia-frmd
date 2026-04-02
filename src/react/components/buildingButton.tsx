import { Card, CardContent, Grid, Stack, Typography } from "@mui/joy";
import React from "react";
import { Link } from "react-router-dom";

import type { EndpointEnum } from "../../enums/endpoint.enum";
import type { GameItemsEnum } from "../../enums/gameItems.enum";
import type { GameItemsCategoryEnum } from "../../enums/gameItemsCategory.enum";
import { useAutoRefetch } from "../../hooks/useAutoRefetch";

type Props = {
  page: string;
  factory: GameItemsEnum;
  assetsLocation: GameItemsCategoryEnum;
  endpoint?: EndpointEnum;
};

export const BuildingButton: React.FC<Props> = ({
  page,
  factory,
  assetsLocation,
  endpoint,
}) => {
  const { data } = useAutoRefetch<unknown[], unknown[]>(endpoint, !endpoint);

  // Hide if the endpoint has resolved with zero buildings in the world
  if (endpoint && Array.isArray(data) && data.length === 0) return null;

  const link = `/${page}/?${page}=${factory}`;

  return (
    <Grid xs={12} sm={6} md={4}>
      <Link
        to={link}
        style={{ textDecoration: "none" }}
      >
        <Card
          variant="outlined"
          sx={{
            height: "100%",
            "&:hover": {
              borderColor: "var(--joy-palette-neutral-700)",
            },
            cursor: "pointer",
          }}
        >
          <CardContent>
            <Stack
              alignItems="center"
              spacing={1.5}
            >
              <img
                src={`/assets/${assetsLocation}/${factory}.png`}
                alt={factory}
                style={{ height: "64px", width: "64px" }}
              />
              <Typography
                level="title-md"
                textAlign="center"
              >
                {factory}
              </Typography>
              <Typography
                level="body-sm"
                textAlign="center"
                sx={{ opacity: 0.75 }}
              >
                Open panel
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Link>
    </Grid>
  );
};
