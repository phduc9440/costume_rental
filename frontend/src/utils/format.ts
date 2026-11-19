/** Formats a number as Vietnamese đồng, e.g. 150000 -> "150.000đ". */
export const formatVND = (value: number | null | undefined): string =>
  `${(value ?? 0).toLocaleString('vi-VN')}đ`;
