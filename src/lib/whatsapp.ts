export function generateWhatsAppLink(
  phoneNumber: string,
  message: string
): string {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, "");
  // Prepend 91 if 10-digit Indian number without country code
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${formattedPhone}?text=${encodedText}`;
}

export const WhatsAppTemplates = {
  membershipReminder: (name: string, planName: string, daysLeft: number) =>
    `Hi ${name}, this is FitFlow Fitness Club. Your ${planName} membership expires in ${daysLeft} ${daysLeft === 1 ? "day" : "days"}. Please contact our reception desk or reply here to renew your membership and avoid any disruption.`,

  paymentReminder: (name: string, planName: string, amount: number) =>
    `Hi ${name}, this is FitFlow Fitness Club. We noticed an outstanding membership fee of ₹${amount.toLocaleString("en-IN")} for your ${planName} plan. Please complete the payment at the front desk or via UPI.`,

  trialConfirmation: (name: string, date: string, time: string) =>
    `Hi ${name}, your 1-Day Free Trial Pass at FitFlow Fitness has been confirmed for ${date} (${time})! Please bring workout attire and a gym towel. Our coaches are excited to welcome you!`,

  welcomeMessage: (name: string, planName: string) =>
    `Welcome to FitFlow Fitness Club, ${name}! Your ${planName} membership is now active. You can log into your member portal anytime to check attendance streaks, diet plans, and your assigned trainer's workouts. Train Hard!`,
};
