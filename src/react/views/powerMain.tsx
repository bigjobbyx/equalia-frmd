import {
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Typography,
} from "@mui/joy";
import React from "react";
import {
  BsBatteryHalf,
  BsCheck,
  BsCloudSlash,
  BsExclamationCircle,
  BsExclamationTriangleFill,
} from "react-icons/bs";
import { GiCargoCrate } from "react-icons/gi";

import { gameItemsDictionnary } from "../../dictionaries/gameItems.dictionary";
import { EndpointEnum } from "../../enums/endpoint.enum";
import { GameItemsCategoryEnum } from "../../enums/gameItemsCategory.enum";
import { gameItemFilterHelper } from "../../helpers/gameItemFilter.helper";
import { objectEntriesToArrayHelper } from "../../helpers/objectEntriesToArray.helper";
import { useAutoRefetch } from "../../hooks/useAutoRefetch";
import type { PowerDto } from "../../types/apis/dataTransferObject/powerDto";
import type { PowerFm } from "../../types/apis/frontModel/powerFm";
import type { GameItems } from "../../types/gameItems/gameItems";
import { BuildingButton } from "../components/buildingButton";

export const PowerMain: React.FC = () => {
  const { data: power } = useAutoRefetch<PowerDto[], PowerFm[]>(
    EndpointEnum.POWER,
  );

  const generators = objectEntriesToArrayHelper<GameItems>(
    gameItemFilterHelper({
      gameItemsDictionnary,
      filter: "generatorsWithEndpoint",
    }),
  );

  let allCapacity = 0;
  let allProduction = 0;
  let allBatteryCapacity = 0;
  let fuseBroken = false;

  if (power) {
    power.forEach((element) => {
      allCapacity += element.powerCapacity;
      allProduction += element.powerProduction;
      allBatteryCapacity += element.batteryCapacity;
      if (!fuseBroken && element.fuseTriggered) {
        fuseBroken = true;
      }
    });
  }

  return (
    <Container
      maxWidth="xl"
      sx={{
        pt: { xs: 2, sm: 5 },
        px: { xs: 1, sm: 2 },
      }}
    >
      <Card
        variant="outlined"
        sx={{ marginBottom: "20px" }}
      >
        <CardContent>
          <Grid
            container
            display="flex"
            alignItems="center"
          >
            <Grid xs>
              <Typography
                level="h2"
                marginBottom="5px"
                fontWeight={600}
                sx={{ fontSize: { xs: "1.75rem", sm: "2.4rem" } }}
              >
                All Power
              </Typography>
            </Grid>
            <Grid>
              <IconButton size="lg">
                <GiCargoCrate
                  size="22px"
                  color="rgba(255,255,255,0.1)"
                />
              </IconButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card
        variant="outlined"
        sx={{ marginBottom: "20px" }}
      >
        <CardContent>
          <Card
            variant="outlined"
            sx={{ marginBottom: "20px" }}
          >
            <CardContent>
              <Grid
                container
                display="flex"
                alignItems="center"
              >
                <Grid xs>
                  <Typography
                    level="h3"
                    marginBottom="5px"
                    fontWeight={600}
                    sx={{ fontSize: { xs: "1.25rem", sm: "1.75rem" } }}
                  >
                    Power Generators
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid
            container
            spacing={2}
          >
            {generators.map((generator) => {
              return (
                <BuildingButton
                  key={generator.name}
                  page="generator"
                  factory={generator.name}
                  assetsLocation={GameItemsCategoryEnum.Building}
                />
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      <Grid
        container
        spacing={2}
        sx={{ marginBottom: "20px" }}
      >
        <Grid xs={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography level="h3">
                {!power ? (
                  <Skeleton
                    sx={{ marginBottom: "8px" }}
                    variant="rectangular"
                    height="30px"
                    width="80px"
                  />
                ) : (
                  <>
                    {new Intl.NumberFormat("en-GB", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(allCapacity)}{" "}
                    MW
                  </>
                )}
              </Typography>
              <Typography>Total Capacity</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography level="h3">
                {!power ? (
                  <Skeleton
                    sx={{ marginBottom: "8px" }}
                    variant="rectangular"
                    height="30px"
                    width="80px"
                  />
                ) : (
                  <>
                    {new Intl.NumberFormat("en-GB", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(allProduction)}{" "}
                    MW
                  </>
                )}
              </Typography>
              <Typography>Total Production</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={6} md={3}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography level="h3">
                {!power ? (
                  <Skeleton
                    sx={{ marginBottom: "8px" }}
                    variant="rectangular"
                    height="30px"
                    width="80px"
                  />
                ) : (
                  <>
                    {new Intl.NumberFormat("en-US", {
                      style: "decimal",
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(allBatteryCapacity)}{" "}
                    MWh
                  </>
                )}
              </Typography>
              <Typography>Battery Capacity</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={6} md={3}>
          {!power && (
            <Skeleton
              sx={{ marginBottom: "8px", width: "100%", borderRadius: "10px" }}
              variant="rectangular"
              height="100%"
            />
          )}
          {!!power && !fuseBroken && (
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography level="h3">No Problems</Typography>
                <Typography>Current Status</Typography>
              </CardContent>
            </Card>
          )}
          {!!power && fuseBroken && (
            <Card sx={{ height: "100%" }}>
              <CardContent>
                <Typography level="h3">Fuse Broken!</Typography>
                <Typography>Current Status</Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      <Divider sx={{ marginBottom: "30px" }} />

      <Typography
        level="h4"
        sx={{ marginTop: "20px", marginBottom: "20px" }}
      >
        All Power Circuits
      </Typography>

      {power ? (
        <>
          {power.map((powerGroup, index: number) => {
            return (
              <Card
                key={powerGroup.id}
                variant="outlined"
                sx={{
                  marginBottom: "20px",
                  padding: { xs: "12px", sm: "20px" },
                  backgroundColor: "var(--joy-palette-background-surface)",
                }}
              >
                <CardContent>
                  <Grid
                    container
                    spacing={1.5}
                    sx={{ marginBottom: "20px" }}
                    alignItems="center"
                  >
                    <Grid xs={12} sm>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        {powerGroup.fuseTriggered && (
                          <BsExclamationCircle
                            size="20px"
                            style={{ marginRight: "10px" }}
                          />
                        )}
                        <Typography level="h4">
                          Power Circuit #{index + 1}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid xs={12} sm="auto">
                      {powerGroup.fuseTriggered ? (
                        <Chip
                          variant="soft"
                          startDecorator={
                            <BsExclamationTriangleFill size="17px" />
                          }
                          sx={{ paddingLeft: "6px" }}
                          color="danger"
                        >
                          FUSE BROKEN
                        </Chip>
                      ) : (
                        <Chip
                          variant="soft"
                          startDecorator={<BsCheck size="22px" />}
                          sx={{ paddingLeft: "6px" }}
                          color="success"
                        >
                          Fuse: All Good
                        </Chip>
                      )}
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={2}
                  >
                    <Grid xs={6} md={3}>
                      <Card
                        variant="outlined"
                        sx={{ height: "100%" }}
                      >
                        <CardContent>
                          <Typography level="h4">
                            {new Intl.NumberFormat("en-US", {
                              style: "decimal",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(powerGroup.powerCapacity)}{" "}
                            MW
                          </Typography>
                          <Typography level="body-md">Capacity</Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid xs={6} md={3}>
                      <Card
                        variant="outlined"
                        sx={{ height: "100%" }}
                      >
                        <CardContent>
                          <Typography level="h4">
                            {new Intl.NumberFormat("en-US", {
                              style: "decimal",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(powerGroup.powerProduction)}{" "}
                            MW
                          </Typography>
                          <Typography level="body-md">Production</Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid xs={6} md={3}>
                      <Card
                        variant="outlined"
                        sx={{ height: "100%" }}
                      >
                        <CardContent>
                          <Typography level="h4">
                            {new Intl.NumberFormat("en-US", {
                              style: "decimal",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(powerGroup.powerConsumed)}{" "}
                            MW
                          </Typography>
                          <Typography level="body-md">Consumption</Typography>
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid xs={6} md={3}>
                      <Card
                        variant="outlined"
                        sx={{ height: "100%" }}
                      >
                        <CardContent>
                          <Typography level="h4">
                            {new Intl.NumberFormat("en-US", {
                              style: "decimal",
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(powerGroup.powerMaxConsumed)}{" "}
                            MW
                          </Typography>
                          <Typography level="body-md">Max Used</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    spacing={1.5}
                    sx={{ marginTop: "24px" }}
                    alignItems="center"
                  >
                    <Grid xs={12} sm>
                      <Typography level="h4">Battery</Typography>
                    </Grid>

                    <Grid xs={12} sm="auto">
                      {powerGroup.batteryCapacity === 0 ? (
                        <Chip
                          startDecorator={<BsCloudSlash size="20px" />}
                          sx={{ paddingLeft: "6px" }}
                          variant="soft"
                        >
                          No Battery connected
                        </Chip>
                      ) : (
                        <Chip
                          startDecorator={<BsBatteryHalf size="20px" />}
                          sx={{ paddingLeft: "6px", color: "white" }}
                          variant="soft"
                          color="success"
                        >
                          Battery connected
                        </Chip>
                      )}
                    </Grid>
                  </Grid>

                  {powerGroup.batteryCapacity !== 0 && (
                    <Grid
                      container
                      spacing={2}
                      sx={{ marginTop: "20px" }}
                    >
                      <Grid xs={6} md={3}>
                        <Card
                          variant="outlined"
                          sx={{ height: "100%" }}
                        >
                          <CardContent>
                            <Typography level="h4">
                              {powerGroup.batteryCapacity} MWh
                            </Typography>
                            <Typography level="body-md">
                              Capacity
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid xs={6} md={3}>
                        <Card
                          variant="outlined"
                          sx={{ height: "100%" }}
                        >
                          <CardContent>
                            <Typography level="h4">
                              {Math.round(powerGroup.batteryPercent * 100) / 100} %
                            </Typography>
                            <Typography level="body-md">
                              Filled
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid xs={6} md={3}>
                        <Card
                          variant="outlined"
                          sx={{ height: "100%" }}
                        >
                          <CardContent>
                            <Typography level="h4">
                              {Math.round(powerGroup.batteryDifferential * 100) /
                                100}{" "}
                              MW
                            </Typography>
                            <Typography level="body-md">
                              Differential
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>

                      <Grid xs={6} md={3}>
                        <Card
                          variant="outlined"
                          sx={{ height: "100%" }}
                        >
                          <CardContent>
                            <Typography level="h4">
                              {powerGroup.batteryTimeEmpty !== "00:00:00"
                                ? powerGroup.batteryTimeEmpty
                                : powerGroup.batteryTimeFull}
                            </Typography>
                            <Typography level="body-md">
                              {powerGroup.batteryTimeEmpty !== "00:00:00"
                                ? "Empty At"
                                : "Full At"}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    </Grid>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </>
      ) : (
        <Card sx={{ marginBottom: "20px", padding: "20px", opacity: 0.5 }}>
          <CardContent>
            <Grid
              container
              sx={{ marginBottom: "20px" }}
            >
              <Grid xs>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Skeleton
                    variant="text"
                    width="80px"
                  />
                </Box>
              </Grid>
              <Grid>
                <Skeleton
                  variant="text"
                  width="120px"
                />
              </Grid>
            </Grid>

            <Grid
              container
              spacing={2}
            >
              <Grid xs={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography level="h4">
                      <Skeleton
                        variant="text"
                        width="110px"
                      />
                    </Typography>
                    <Typography
                      marginTop="10px"
                      level="body-md"
                    >
                      Power Capacity
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid xs={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography level="h4">
                      <Skeleton
                        variant="text"
                        width="80px"
                      />
                    </Typography>
                    <Typography
                      marginTop="10px"
                      level="body-md"
                    >
                      Power Production
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid xs={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography level="h4">
                      <Skeleton
                        variant="text"
                        width="90px"
                      />
                    </Typography>
                    <Typography
                      marginTop="10px"
                      level="body-md"
                    >
                      Current consumption
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid xs={6} md={3}>
                <Card variant="outlined">
                  <CardContent>
                    <Typography level="h4">
                      <Skeleton
                        variant="text"
                        width="80px"
                      />
                    </Typography>
                    <Typography
                      marginTop="10px"
                      level="body-md"
                    >
                      Max. Consumed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Grid
              container
              sx={{ marginTop: "30px" }}
            >
              <Grid xs>
                <Typography level="h4">Battery</Typography>
              </Grid>
              <Grid>
                <Skeleton
                  variant="text"
                  width="80px"
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};
