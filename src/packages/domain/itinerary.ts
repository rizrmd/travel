/**
 * Epic 4, Story 4.2: Itinerary Domain Model
 *
 * Core business logic for itinerary management including:
 * - Day-by-day itinerary items
 * - Activity scheduling
 * - Meals tracking
 */

export interface Activity {
  time: string; // Format: "HH:mm" (e.g., "08:00")
  activity: string;
  location: string;
}

export interface MealsIncluded {
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export class ItineraryItem {
  id: string;
  tenantId: string;
  packageId: string;
  dayNumber: number;
  title: string;
  description: string | null;
  activities: Activity[];
  accommodation: string | null;
  mealsIncluded: MealsIncluded;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<ItineraryItem>) {
    Object.assign(this, data);
  }

  /**
   * Validate day number is positive
   */
  static isValidDayNumber(dayNumber: number): boolean {
    return dayNumber > 0 && Number.isInteger(dayNumber);
  }

  /**
   * Validate day number doesn't exceed package duration
   */
  static isWithinDuration(dayNumber: number, packageDuration: number): boolean {
    return dayNumber <= packageDuration;
  }

  /**
   * Validate activity time format (HH:mm)
   */
  static isValidTime(time: string): boolean {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timeRegex.test(time);
  }

  /**
   * Validate activities array
   */
  static areValidActivities(activities: Activity[]): boolean {
    if (!Array.isArray(activities)) return false;

    for (const activity of activities) {
      if (!activity.time || !activity.activity || !activity.location) {
        return false;
      }
      if (!ItineraryItem.isValidTime(activity.time)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Sort activities by time
   */
  getSortedActivities(): Activity[] {
    return [...this.activities].sort((a, b) => {
      return a.time.localeCompare(b.time);
    });
  }

  /**
   * Get count of meals included
   */
  getMealsCount(): number {
    let count = 0;
    if (this.mealsIncluded.breakfast) count++;
    if (this.mealsIncluded.lunch) count++;
    if (this.mealsIncluded.dinner) count++;
    return count;
  }

  /**
   * Check if all meals are included
   */
  hasAllMeals(): boolean {
    return (
      this.mealsIncluded.breakfast &&
      this.mealsIncluded.lunch &&
      this.mealsIncluded.dinner
    );
  }

  /**
   * Get meals display string in Indonesian
   */
  getMealsDisplay(): string {
    const meals: string[] = [];
    if (this.mealsIncluded.breakfast) meals.push("Sarapan");
    if (this.mealsIncluded.lunch) meals.push("Makan Siang");
    if (this.mealsIncluded.dinner) meals.push("Makan Malam");

    if (meals.length === 0) return "Tidak ada makan";
    if (meals.length === 3)
      return "Semua makan (Sarapan, Makan Siang, Makan Malam)";

    return meals.join(", ");
  }

  /**
   * Get duration of the day (from first to last activity)
   */
  getDayDuration(): string | null {
    if (this.activities.length === 0) return null;

    const sorted = this.getSortedActivities();
    const firstTime = sorted[0].time;
    const lastTime = sorted[sorted.length - 1].time;

    return `${firstTime} - ${lastTime}`;
  }

  /**
   * Add activity to itinerary
   */
  addActivity(activity: Activity): void {
    if (!ItineraryItem.isValidTime(activity.time)) {
      throw new Error(
        `Invalid time format: ${activity.time}. Use HH:mm format.`,
      );
    }
    this.activities.push(activity);
    this.updatedAt = new Date();
  }

  /**
   * Remove activity from itinerary
   */
  removeActivity(index: number): void {
    if (index < 0 || index >= this.activities.length) {
      throw new Error("Invalid activity index");
    }
    this.activities.splice(index, 1);
    this.updatedAt = new Date();
  }

  /**
   * Update activity
   */
  updateActivity(index: number, activity: Activity): void {
    if (index < 0 || index >= this.activities.length) {
      throw new Error("Invalid activity index");
    }
    if (!ItineraryItem.isValidTime(activity.time)) {
      throw new Error(
        `Invalid time format: ${activity.time}. Use HH:mm format.`,
      );
    }
    this.activities[index] = activity;
    this.updatedAt = new Date();
  }
}
