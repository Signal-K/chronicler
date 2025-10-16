import type { PlotComponentProps } from '@/types/plant';
import { PlantComponent } from './Plant';

export function PlotComponent({ plot, selectedTool, onPlant, onWater }: PlotComponentProps) {
  const handleClick = () => {
    if (selectedTool === 'grass' && plot.isTilled && !plot.plant) {
      onPlant(plot.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        width: '64px',
        height: '64px',
        position: 'absolute',
        left: `${plot.x}px`,
        top: `${plot.y}px`,
        cursor: selectedTool === 'grass' && plot.isTilled && !plot.plant ? 'pointer' : 'default',
        border: selectedTool === 'grass' && plot.isTilled && !plot.plant ? '2px dashed green' : 'none',
      }}
    >
      {plot.plant && (
        <PlantComponent
          plant={plot.plant}
          onWater={() => onWater(plot.id)}
        />
      )}
    </div>
  );
}
