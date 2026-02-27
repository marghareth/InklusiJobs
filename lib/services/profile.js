import { createClient } from "@/lib/supabase/client";

export async function saveBasicInfo(formData) {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name:             formData.firstName,
      last_name:              formData.lastName,
      age:                    Number(formData.age),
      current_address:        formData.currentAddress,
      permanent_address:      formData.permanentAddress,
      contact_number:         formData.contactNumber,
      educational_attainment: formData.educationalAttainment,
      updated_at:             new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) throw error;
}