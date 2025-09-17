//  Function to calculate discount
export function DiscountCalculation(totalPrice, discountPercent) {
  if (!totalPrice || totalPrice <= 0) return { discount: 0, finalPrice: 0 };

  const discount = (totalPrice * discountPercent) / 100;
  const finalPrice = totalPrice - discount;

  return { discount, finalPrice };
}
export const applyCoupon = (code) => {
  const coupons = {
    RATAN10: 10,
    NAGU20: 20,
    HEMANTH30: 30,
  };

  if (coupons[code]) {
    return { success: true, discount: coupons[code] };
  } else {
    return { success: false, discount: 0 };
  }
};

