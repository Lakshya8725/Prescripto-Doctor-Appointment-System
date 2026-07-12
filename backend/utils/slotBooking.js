import doctorModel from "../models/doctorModel.js";

const slotField = (slotDate) => `slots_booked.${slotDate}`;

/**
 * Atomically reserve a slot. Only one concurrent request can succeed.
 * Returns updated doctor doc, or null if doctor missing / slot already taken.
 */
export const reserveSlot = async (docId, slotDate, slotTime) => {
  return doctorModel.findOneAndUpdate(
    {
      _id: docId,
      [slotField(slotDate)]: { $nin: [slotTime] },
    },
    { $push: { [slotField(slotDate)]: slotTime } },
    { new: true },
  );
};

/** Release a reserved slot (cancel flow). */
export const releaseSlot = async (docId, slotDate, slotTime) => {
  await doctorModel.findByIdAndUpdate(docId, {
    $pull: { [slotField(slotDate)]: slotTime },
  });
};
