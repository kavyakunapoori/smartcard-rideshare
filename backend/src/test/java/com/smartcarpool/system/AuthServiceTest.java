package com.smartcarpool.system;

import com.smartcarpool.system.dto.request.LoginRequest;
import com.smartcarpool.system.dto.request.RegisterRequest;
import com.smartcarpool.system.dto.response.AuthResponse;
import com.smartcarpool.system.entity.Role;
import com.smartcarpool.system.entity.User;
import com.smartcarpool.system.exception.BadRequestException;
import com.smartcarpool.system.exception.DuplicateResourceException;
import com.smartcarpool.system.repository.UserRepository;
import com.smartcarpool.system.security.JwtTokenProvider;
import com.smartcarpool.system.security.UserPrincipal;
import com.smartcarpool.system.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    private JwtTokenProvider tokenProvider;
    private AuthService authService;

    private RegisterRequest registerRequest;
    private User user;

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider();
        ReflectionTestUtils.setField(tokenProvider, "jwtSecret", "smartcarpooljwtsecretkey2026supersecuredefaultsigningkeywithmin256bitslength");
        ReflectionTestUtils.setField(tokenProvider, "jwtExpirationInMs", 86400000L);

        authService = new AuthService(userRepository, passwordEncoder, authenticationManager, tokenProvider);

        registerRequest = new RegisterRequest(
                "Jane Doe",
                "jane@example.com",
                "Password@123",
                "Password@123",
                "+1 555-0199"
        );

        user = new User(1L, "jane@example.com", "encodedPassword", "Jane Doe", "+1 555-0199", Role.ROLE_USER);
    }

    @Test
    @DisplayName("Should successfully register a new user")
    void register_Success() {
        when(userRepository.existsByEmail("jane@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password@123")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(user);

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertTrue(response.getToken().length() > 20);
        assertEquals("jane@example.com", response.getUser().getEmail());
        assertEquals("Jane Doe", response.getUser().getFullName());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should reject registration when email already exists")
    void register_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByEmail("jane@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should reject registration when passwords do not match")
    void register_MismatchedPasswords_ThrowsException() {
        registerRequest.setConfirmPassword("DifferentPassword");

        assertThrows(BadRequestException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).existsByEmail(anyString());
    }

    @Test
    @DisplayName("Should authenticate user and return token on login")
    void login_Success() {
        LoginRequest loginRequest = new LoginRequest("jane@example.com", "Password@123");
        UserPrincipal principal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(userRepository.findByEmail("jane@example.com")).thenReturn(Optional.of(user));

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertTrue(response.getToken().length() > 20);
        assertEquals("jane@example.com", response.getUser().getEmail());
    }
}
