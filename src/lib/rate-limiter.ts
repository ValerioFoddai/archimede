interface TokenBucket {
  tokens: number;
  lastRefill: number;
}

const TOKENS_PER_MINUTE = 40000;
const REFILL_RATE = TOKENS_PER_MINUTE / 60; // tokens per second
const MAX_TOKENS = TOKENS_PER_MINUTE;

class RateLimiter {
  private bucket: TokenBucket = {
    tokens: MAX_TOKENS,
    lastRefill: Date.now(),
  };

  private refillTokens() {
    const now = Date.now();
    const timePassed = (now - this.bucket.lastRefill) / 1000; // convert to seconds
    const tokensToAdd = Math.floor(timePassed * REFILL_RATE);

    if (tokensToAdd > 0) {
      this.bucket.tokens = Math.min(MAX_TOKENS, this.bucket.tokens + tokensToAdd);
      this.bucket.lastRefill = now;
    }
  }

  async consumeTokens(tokens: number): Promise<boolean> {
    this.refillTokens();

    if (this.bucket.tokens >= tokens) {
      this.bucket.tokens -= tokens;
      return true;
    }

    // If not enough tokens, calculate wait time
    const tokensNeeded = tokens - this.bucket.tokens;
    const waitTime = (tokensNeeded / REFILL_RATE) * 1000; // convert to milliseconds
    
    // Wait for tokens to refill
    await new Promise(resolve => setTimeout(resolve, waitTime));
    
    // Try again after waiting
    return this.consumeTokens(tokens);
  }

  getAvailableTokens(): number {
    this.refillTokens();
    return this.bucket.tokens;
  }
}

// Create a singleton instance
export const rateLimiter = new RateLimiter();

// Utility function to estimate tokens from input
export function estimateTokens(input: string): number {
  // Rough estimation: ~4 characters per token on average
  return Math.ceil(input.length / 4);
}
