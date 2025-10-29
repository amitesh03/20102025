use anchor_lang::prelude::*;

declare_id!("11111111111111111111111111111111"); // Replace with your program id

#[program]
pub mod counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        counter.bump = *ctx.bumps.get("counter").unwrap();
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        // Example of checked math to avoid overflow
        counter.count = counter.count.checked_add(1).ok_or(ErrorCode::MathOverflow)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = payer,
        seeds = [b"counter", payer.key().as_ref()],
        bump,
        space = 8 + Counter::SIZE
    )]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(
        mut,
        seeds = [b"counter", payer.key().as_ref()],
        bump = counter.bump,
        has_one = owner @ ErrorCode::InvalidOwner
    )]
    pub counter: Account<'info, Counter>,
    pub payer: Signer<'info>,
    /// The account that owns the counter state
    pub owner: UncheckedAccount<'info>,
}

#[account]
pub struct Counter {
    pub count: u64,
    pub bump: u8,
    pub owner: Pubkey,
}

impl Counter {
    // 8 bytes discriminator handled by Anchor. Size for fields below:
    // count (8) + bump (1) + owner (32) = 41 bytes
    pub const SIZE: usize = 8 + 1 + 32;
}

#[error_code]
pub enum ErrorCode {
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Invalid owner")]
    InvalidOwner,
}
