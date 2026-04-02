import {
  Card,
  CardContent,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/joy";
import React, { useCallback, useEffect, useState } from "react";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";

import { gameItemsDictionnary } from "../../dictionaries/gameItems.dictionary";
import { EndpointEnum } from "../../enums/endpoint.enum";
import { getImageHelper } from "../../helpers/getImage.helper";
import { useAutoRefetch } from "../../hooks/useAutoRefetch";
import type { ProdStatsDto } from "../../types/apis/dataTransferObject/prodStatsDto";
import type { WorldInvDto } from "../../types/apis/dataTransferObject/worldInvDto";
import type { ProductionStatFm } from "../../types/apis/frontModel/productionStatFm";
import type { WorldInvFm } from "../../types/apis/frontModel/worldInvFm";

type ItemData = ProductionStatFm & Pick<WorldInvFm, "amount">;

export const StorageView: React.FC = () => {
  const { data: worldInv } = useAutoRefetch<WorldInvDto[], WorldInvFm[]>(
    EndpointEnum.WORLD_INV,
  );

  const { data: prodStats } = useAutoRefetch<
    ProdStatsDto[],
    ProductionStatFm[]
  >(EndpointEnum.PRODUCTION_STAT);

  const [items, setItems] = useState<ItemData[]>();

  const handlePrepareItems = useCallback(() => {
    const temp: ItemData[] = [];
    worldInv?.forEach((item) => {
      const foundedItem = prodStats?.find(
        (prodItem) => prodItem.name === item.name,
      );
      if (foundedItem) temp.push({ ...foundedItem, amount: item.amount });
      if (!foundedItem)
        temp.push({
          name: item.name,
          className: item.className,
          amount: 0,
          currentProduction: 0,
          currentConsumption: 0,
          percentProduction: 0,
          percentConsumption: 0,
          maxProduction: 0,
          maxConsumption: 0,
          productionPerMinunte: "P:0.0/min - C: 0.0/min",
        });
    });
    setItems(temp);
  }, [worldInv, prodStats]);

  useEffect(() => {
    handlePrepareItems();
  }, [handlePrepareItems]);

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
        sx={{ paddingBottom: "0px", marginBottom: "30px" }}
      >
        <CardContent>
          <Grid
            container
            display="flex"
            alignItems="center"
            marginBottom="20px"
          >
            <Grid xs>
              <Typography
                level="h2"
                fontWeight={600}
                sx={{ fontSize: { xs: "1.75rem", sm: "2.4rem" } }}
              >
                All Items in World
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {items ? (
        <Grid
          container
          paddingY={0}
          px={0}
          spacing={2}
        >
          {items.map((item) => {
            return (
              <Grid
                xs={6}
                sm={4}
                md={3}
                key={item.className}
              >
                <Card
                  variant="outlined"
                  sx={{
                    height: "100%",
                    padding: "3px",
                    borderColor:
                      Math.floor(item.currentConsumption) >
                      Math.floor(item.currentProduction)
                        ? "var(--joy-palette-warning-main)"
                        : "var(--joy-palette-neutral-outlinedBorder)",
                    borderWidth:
                      Math.floor(item.currentConsumption) >
                      Math.floor(item.currentProduction)
                        ? "3px"
                        : "1px",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "16px",
                      textAlign: "center",
                      height: "100%",
                    }}
                  >
                    {gameItemsDictionnary[item.className] !== undefined && (
                      <img
                        src={getImageHelper(item.className) ?? null}
                        alt="Satisfactory item illustration"
                        style={{ height: "64px", width: "64px" }}
                      />
                    )}
                    {gameItemsDictionnary[item.className] === undefined && (
                      <HiOutlineQuestionMarkCircle size="64px" />
                    )}
                    <Typography
                      level="title-md"
                      marginBottom="5px"
                    >
                      {item.name}
                    </Typography>
                    <Typography level="body-md">
                      Total: {item.amount}
                    </Typography>
                    <Typography level="body-sm">
                      {item.productionPerMinunte}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      ) : (
        <Grid
          container
          paddingY={0}
          px={0}
          spacing={2}
          sx={{ opacity: 0.5 }}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <Grid
              key={`storage-skeleton-${n}`}
              xs={6}
              sm={4}
              md={3}
            >
              <Card
                variant="outlined"
                sx={{ height: "100%", padding: 0 }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px",
                    textAlign: "center",
                    height: "100%",
                  }}
                >
                  <Skeleton
                    variant="circular"
                    height="64px"
                    width="64px"
                    sx={{ marginBottom: "10px" }}
                  />
                  <Skeleton
                    variant="text"
                    width="90px"
                    sx={{ marginBottom: "10px" }}
                  />
                  <Skeleton
                    variant="text"
                    width="60px"
                    sx={{ marginBottom: "10px" }}
                  />
                  <Skeleton
                    variant="text"
                    width="140px"
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};
