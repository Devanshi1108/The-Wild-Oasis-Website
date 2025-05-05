"use server";

import { revalidatePath } from "next/cache";
import { auth, signIn, signOut } from "./auth";
import { supabase } from "./supabase";
import { getBookings } from "./data-service";
import { redirect } from "next/navigation";

export async function signInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function updateProfileFormAction(formData) {
  //make sure data is safe
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const nationalID = formData.get("nationalID");
  const [nationality, countryFlag] = formData.get("nationality").split("%");

  //check if we have correct national ID
  const regex = /^[a-zA-Z0-9]{6,12}$/;
  if (!regex.test(nationalID)) throw new Error("Invalid National ID");

  const updateData = { nationalID, nationality, countryFlag };

  const { data, error } = await supabase
    .from("guests")
    .update(updateData)
    .eq("id", session.user.guestId);

  if (error) {
    console.error(error);
    throw new Error("Guest could not be updated");
  }

  revalidatePath("/account/profile");
}

export async function deleteReservationAction(bookingId) {
  //make sure data is safe
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  //check if the booking that is being deleted belongs to the guest
  const guestBookings = await getBookings(session.user.guestId);

  const guestBookingsIds = guestBookings.map((el) => el.id);

  if (!guestBookingsIds.includes(bookingId))
    throw new Error("You are nor allowed to delete this booking");

  const { data, error } = await supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be deleted");
  }

  revalidatePath("/account/reservations");
}

export async function updateReservationAction(formData) {
  const bookingId = Number(formData.get("reservationId"));
  //Authentication: make sure data is safe
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  //Authorization: check if the booking that is being updated belongs to the guest
  const guestBookings = await getBookings(session.user.guestId);

  const guestBookingsIds = guestBookings.map((el) => el.id);

  if (!guestBookingsIds.includes(Number(bookingId)))
    throw new Error("You are nor allowed to update this booking");

  const updatedFields = {
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
  };

  //Mutation
  const { data, error } = await supabase
    .from("bookings")
    .update(updatedFields)
    .eq("id", bookingId);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be updated");
  }

  revalidatePath("/account/reservations");
  revalidatePath(`/account/reservations/edit/${bookingId}`);
  redirect("/account/reservations");
}

export async function createReservationAction(newBooking, formData) {
  //Authentication: make sure data is safe
  const session = await auth();
  if (!session) throw new Error("You must be logged in");

  const newBookingData = {
    ...newBooking,
    guestId: session.user.guestId,
    numGuests: Number(formData.get("numGuests")),
    observations: formData.get("observations").slice(0, 1000),
    extrasPrice: 0,
    totalPrice: newBooking.cabinPrice, //same as cabin price
    isPaid: false,
    hasBreakfast: false,
    status: "unconfirmed",
  };

  //create new booking
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBookingData]);

  if (error) {
    console.error(error);
    throw new Error("Booking could not be created");
  }

  revalidatePath(`/cabin/${newBooking.cabinId}`);
  redirect("/cabins/thankyou");
}
