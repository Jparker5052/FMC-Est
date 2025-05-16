#include <iostream>
#include "fineDeadFuelMoistureTool.h"
#include "behaveUnits.h"

int main(int argc, char* argv[]) {
  if (argc != 9) {
    std::cerr << "Usage: fuel_moisture  aspect dryBulb elev month rh shading slope timeOfDay\n";
    return 1;
  }

  // parse the eight indices
  int aspectIndex     = std::stoi(argv[1]);
  int dryBulbIndex    = std::stoi(argv[2]);
  int elevationIndex  = std::stoi(argv[3]);
  int monthIndex      = std::stoi(argv[4]);
  int rhIndex         = std::stoi(argv[5]);
  int shadingIndex    = std::stoi(argv[6]);
  int slopeIndex      = std::stoi(argv[7]);
  int timeOfDayIndex  = std::stoi(argv[8]);

  FineDeadFuelMoistureTool tool;
  tool.calculateByIndex(
    aspectIndex,
    dryBulbIndex,
    elevationIndex,
    monthIndex,
    rhIndex,
    shadingIndex,
    slopeIndex,
    timeOfDayIndex
  );

  double moisture = tool.getFineDeadFuelMoisture(
    FractionUnits::FractionUnitsEnum::Percent
  );
  std::cout << moisture;
  return 0;
}
