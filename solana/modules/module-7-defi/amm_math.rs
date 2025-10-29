pub fn k(x: u128, y: u128) -> u128 { x.saturating_mul(y) }

// Amount out for swap given input and reserves (x -> y), with 0.3% fee
pub fn amount_out(x_reserve: u128, y_reserve: u128, dx: u128) -> Option<u128> {
    if x_reserve == 0 || y_reserve == 0 { return None; }
    // apply fee
    let dx_fee = dx.saturating_mul(997) / 1000;
    let numerator = dx_fee.saturating_mul(y_reserve);
    let denominator = x_reserve.saturating_add(dx_fee);
    Some(numerator / denominator)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn cp_invariant() {
        assert_eq!(k(10, 20), 200);
    }
    #[test]
    fn swap_out_ok() {
        let out = amount_out(10_000, 20_000, 1_000).unwrap();
        assert!(out > 0);
    }
}