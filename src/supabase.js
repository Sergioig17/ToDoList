import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ahxnocsnxvkfgcvejajd.supabase.co";
const supabasePublishableKey = "sb_publishable_6nsr20YW56M6aLsZdaHuJQ_5m2v6ic2";

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
