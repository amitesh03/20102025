pub fn add_checked(a: u64, b: u64) -> Option<u64> {
    a.checked_add(b)
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn adds_ok() {
        assert_eq!(add_checked(2, 3), Some(5));
    }
    #[test]
    fn detects_overflow() {
        assert_eq!(add_checked(u64::MAX, 1), None);
    }
}