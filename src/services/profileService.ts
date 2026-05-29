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

/**
 * Create a new student profile for the authenticated user.
 */
export const createProfile = async (data: StudentProfileData): Promise<StudentProfileResponse> => {
  try {
    const response = await axiosClient.post<StudentProfileResponse>("/student-profile/me", data);
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
    const response = await axiosClient.put<StudentProfileResponse>("/student-profile/me", data);
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
