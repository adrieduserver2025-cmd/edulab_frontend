import axiosClient from "./api/axiosClient";

export interface StudentProfileData {
  country: string;
  city: string;
  birth_date: string; // YYYY-MM-DD format
  phone: string;
  education_level: string;
  current_institution: string | null;
  area: string;
  english_level: string;
  other_languages: string[] | null;
  interests: string[];
  target_countries: string[];
  target_program_types: string[];
  linkedin_url: string | null;
  portfolio_url: string | null;
  bio: string | null;
  cv_url: string | null;
  expected_graduation_date: string | null;
  work_experience: any[] | null;
  volunteer_experience: any[] | null;
  general_motivation_letter: string | null;
}

export interface StudentProfileResponse extends StudentProfileData {
  id: number;
  user_id: number;
  profile_completion: number;
  created_at: string;
  updated_at: string;
}

/**
 * Fetch the authenticated user's student profile.
 * Returns null or StudentProfileResponse.
 */
export const getMyProfile = async (): Promise<StudentProfileResponse | null> => {
  try {
    const response = await axiosClient.get<StudentProfileResponse | null>("/student-profile/me");
    return response.data;
  } catch (error) {
    console.error("Error fetching student profile:", error);
    throw error;
  }
};

const normalizeDate = (dateStr: string | null | undefined): string | null => {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();
  if (!trimmed) return null;
  // If it's already in YYYY-MM-DD format, return it
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  // If it's in DD/MM/YYYY format, convert to YYYY-MM-DD
  const parts = trimmed.split("/");
  if (parts.length === 3) {
    const [day, month, year] = parts;
    if (day.length === 2 && month.length === 2 && year.length === 4) {
      return `${year}-${month}-${day}`;
    }
  }
  return trimmed;
};

const normalizeProfileDates = <T extends Partial<StudentProfileData>>(data: T): T => {
  const normalized = { ...data };
  if (normalized.birth_date !== undefined) {
    normalized.birth_date = normalizeDate(normalized.birth_date) as any;
  }
  if (normalized.expected_graduation_date !== undefined) {
    normalized.expected_graduation_date = normalizeDate(normalized.expected_graduation_date) as any;
  }
  return normalized;
};

/**
 * Create a new student profile for the authenticated user.
 */
export const createProfile = async (data: StudentProfileData): Promise<StudentProfileResponse> => {
  try {
    const normalizedData = normalizeProfileDates(data);
    const response = await axiosClient.post<StudentProfileResponse>("/student-profile/me", normalizedData);
    return response.data;
  } catch (error) {
    console.error("Error creating student profile:", error);
    throw error;
  }
};

/**
 * Update the authenticated user's existing student profile.
 */
export const updateProfile = async (data: Partial<StudentProfileData>): Promise<StudentProfileResponse> => {
  try {
    const normalizedData = normalizeProfileDates(data);
    const response = await axiosClient.put<StudentProfileResponse>("/student-profile/me", normalizedData);
    return response.data;
  } catch (error) {
    console.error("Error updating student profile:", error);
    throw error;
  }
};

/**
 * Helper to check if a student profile is complete (completion = 100%) and eligible to apply.
 */
export const canApply = (profile: { profile_completion: number } | null | undefined): boolean => {
  return profile?.profile_completion === 100;
};

/**
 * Update the authenticated user's base info (like full_name).
 */
export const updateUser = async (data: { full_name?: string; photo_url?: string }): Promise<any> => {
  try {
    const response = await axiosClient.patch("/users/me", data);
    return response.data;
  } catch (error) {
    console.error("Error updating user base info:", error);
    throw error;
  }
};
