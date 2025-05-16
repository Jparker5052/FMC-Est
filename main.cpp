#include <iostream>
#include "behaveUnits.h"
#include "fineDeadFuelMoistureTool.h"

int main() {
    FineDeadFuelMoistureTool tool;
    int idx;

    // 1) Aspect
    std::cout << "Choose Aspect:\n";
    for (int i = 0; i < tool.getAspectIndexSize(); ++i)
        std::cout << "  " << i << ": " << tool.getAspectLabelAtIndex(i) << "\n";
    std::cout << "> "; std::cin >> idx;
    int aspectIndex = idx;

    // 2) Dry‐Bulb Temperature
    std::cout << "\nChoose Dry‐Bulb Temperature:\n";
    for (int i = 0; i < tool.getDryBulbTemperatureIndexSize(); ++i)
        std::cout << "  " << i << ": " << tool.getDryBulbTemperatureLabelAtIndex(i) << "\n";
    std::cout << "> "; std::cin >> idx;
    int dryBulbIndex = idx;

    // 3) Elevation
    std::cout << "\nChoose Elevation:\n";
    for (int i = 0; i < tool.getElevationIndexSize(); ++i)
        std::cout << "  " << i << ": " << tool.getElevationLabelAtIndex(i) << "\n";
    std::cout << "> "; std::cin >> idx;
    int elevationIndex = idx;

    // 4) Month
    std::cout << "\nChoose Month Range:\n";
    for (int i = 0; i < tool.getMonthIndexSize(); ++i)
        std::cout << "  " << i << ": " << tool.getMonthLabelAtIndex(i) << "\n";
    std::cout << "> "; std::cin >> idx;
    int monthIndex = idx;

    // 5) Relative Humidity
    std::cout << "\nChoose Relative Humidity Range:\n";
    for (int i = 0; i < tool.getRelativeHumidityIndexSize(); ++i)
        std::cout << "  " << i << ": " << tool.getRelativeHumidityLabelAtIndex(i) << "\n";
    std::cout << "> "; std::cin >> idx;
    int rhIndex = idx;

    // 6) Shading
    std::cout << "\nChoose Shading:\n";
    for (int i = 0; i < tool.getShadingIndexSize(); ++i)
        std::cout << "  " << i << ": " << tool.getShadingLabelAtIndex(i) << "\n";
    std::cout << "> "; std::cin >> idx;
    int shadingIndex = idx;

    // 7) Slope
    std::cout << "\nChoose Slope:\n";
    for (int i = 0; i < tool.getSlopeIndexSize(); ++i)
        std::cout << "  " << i << ": " << tool.getSlopeLabelAtIndex(i) << "\n";
    std::cout << "> "; std::cin >> idx;
    int slopeIndex = idx;

    // 8) Time of Day
    std::cout << "\nChoose Time of Day:\n";
    for (int i = 0; i < tool.getTimeOfDayIndexSize(); ++i)
        std::cout << "  " << i << ": " << tool.getTimeOfDayLabelAtIndex(i) << "\n";
    std::cout << "> "; std::cin >> idx;
    int timeOfDayIndex = idx;

  // Perform the calculation
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

    // **Pass the Percent enum** to get the result in %:
    double moisture = tool.getFineDeadFuelMoisture(
      FractionUnits::FractionUnitsEnum::Percent
    );

    std::cout << "\n1-hour fine dead fuel moisture = "
              << moisture << " %\n";

    return 0;
}
