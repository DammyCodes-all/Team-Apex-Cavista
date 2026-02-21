#!/usr/bin/env python3
"""
Demonstration of structured password validation errors from SignUpRequest.
Shows how length, strength, and type errors are reported with JSON details.
"""
import json
from pydantic import ValidationError
from app.models.auth import SignUpRequest


def test_error(label, data):
    """Attempt validation and pretty-print structured error."""
    print(f"\n{'='*60}")
    print(f"Test: {label}")
    print(f"{'='*60}")
    print(f"Input: {data}")
    try:
        result = SignUpRequest.model_validate(data)
        print("✓ Validation passed!")
        return True
    except ValidationError as e:
        print("✗ Validation failed:")
        for err in e.errors():
            loc = err.get('loc')
            error_type = err.get('type')
            msg = err.get('msg')
            print(f"  Field: {loc[0] if loc else 'unknown'}")
            print(f"  Error Type: {error_type}")
            print(f"  Message: {msg}")
            
            # Try to parse JSON details if present
            try:
                details = json.loads(msg)
                print(f"  Details: {json.dumps(details, indent=4)}")
            except (json.JSONDecodeError, ValueError):
                # Message is plain text, not JSON
                pass
        return False


if __name__ == "__main__":
    print("Password Validation Error Examples")
    print("===================================\n")

    # Test 1: Valid password
    test_error(
        "Valid password",
        {
            "email": "user@example.com",
            "password": "SecurePass123!",
            "name": "John Doe"
        }
    )

    # Test 2: Password too short
    test_error(
        "Password too short (< 8 chars)",
        {
            "email": "user@example.com",
            "password": "Short1!",
            "name": "John Doe"
        }
    )

    # Test 3: Password too long
    test_error(
        "Password too long (> 128 chars)",
        {
            "email": "user@example.com",
            "password": "A" * 129,
            "name": "John Doe"
        }
    )

    # Test 4: Missing uppercase
    test_error(
        "Missing uppercase letter",
        {
            "email": "user@example.com",
            "password": "lowercase123!",
            "name": "John Doe"
        }
    )

    # Test 5: Missing lowercase
    test_error(
        "Missing lowercase letter",
        {
            "email": "user@example.com",
            "password": "UPPERCASE123!",
            "name": "John Doe"
        }
    )

    # Test 6: Missing digit
    test_error(
        "Missing digit",
        {
            "email": "user@example.com",
            "password": "NoDigitsHere!",
            "name": "John Doe"
        }
    )

    # Test 7: Missing special character
    test_error(
        "Missing special character",
        {
            "email": "user@example.com",
            "password": "NoSpecialChar123",
            "name": "John Doe"
        }
    )

    # Test 8: Multiple missing requirements
    test_error(
        "Multiple missing requirements (no uppercase, no digit, no special)",
        {
            "email": "user@example.com",
            "password": "lowercase",
            "name": "John Doe"
        }
    )

    # Test 9: Valid long password (Argon2 supports arbitrary length)
    test_error(
        "Valid long password (256 chars, within 128 limit but shows Argon2 support)",
        {
            "email": "user@example.com",
            "password": "ThisIsAVeryLongPasswordWithManyCharactersAndComplexity123!".ljust(128, "!"),
            "name": "John Doe"
        }
    )

    # Test 10: Invalid email
    test_error(
        "Invalid email format",
        {
            "email": "not-an-email",
            "password": "ValidPass123!",
            "name": "John Doe"
        }
    )
