
import { Vehicle } from './types';

export const extractAllTags = (vehicles: Vehicle[]): string[] => {
    const allTags = new Set<string>();
    vehicles.forEach(vehicle => {
        if (vehicle.tags) {
            vehicle.tags.split(',').forEach(tag => {
                if (tag.trim()) {
                    allTags.add(tag.trim());
                }
            });
        }
    });
    return Array.from(allTags);
};
