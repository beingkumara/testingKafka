/**
 * Utility to get the local race track image for a specific round.
 * 
 * This uses Vite's eager glob import to bundle all images in src/assets/race_track/
 * and allows retrieving them by round number.
 */

// Import all images from the race_track directory eagerly
const raceTrackImages = import.meta.glob('../assets/race_track/*.png', { eager: true });

/**
 * Get the race track image path key for a given round.
 * Validates availability and returns the image module default export (the URL/path).
 * 
 * @param round - The race round number (e.g., 1, "1", "01")
 * @returns The image path, or undefined if not found.
 */
export const getRaceTrackImage = (round: string | number): string | undefined => {
    if (!round) return undefined;

    // Normalize round to string, remove leading zeros for lookup consistency with filenames if needed, 
    // but based on file list (round1.png, round10.png), it seems they are just 'round' + number.
    // We'll try to match exact filename pattern 'round{N}.png'.
    const roundStr = String(round);
    const normalizedRound = parseInt(roundStr, 10).toString(); // removes leading zeros if any, e.g. "01" -> "1"

    const pathKey = `../assets/race_track/round${normalizedRound}.png`;

    const imageModule = raceTrackImages[pathKey];

    if (imageModule && typeof imageModule === 'object' && 'default' in imageModule) {
        return (imageModule as { default: string }).default;
    }

    return undefined;
};

import defaultProfilePic from '../assets/default_profile.png';

/**
 * Default profile picture URL for users who haven't uploaded one.
 * Uses a standard ghost/silhouette avatar from local assets.
 */
export const DEFAULT_PROFILE_PICTURE = defaultProfilePic;
