package com.example.app.security;

import com.example.app.models.User;
import com.example.app.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Component
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Value("${app.oauth2.redirectUri:http://localhost:5173/oauth2/redirect}")
    private String redirectUri;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication)
            throws IOException {
        if (response.isCommitted()) {
            return;
        }

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String pictureUrl = (String) attributes.get("picture");
        String provider = "google"; // This can be dynamic based on the provider
        String providerId = (String) attributes.get("sub");

        // Find existing user or create a new one
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;

        if (userOptional.isPresent()) {
            // User exists, update only if necessary
            user = userOptional.get();
            // Update provider and providerId if they differ (e.g., in case of provider changes)
            if (!provider.equals(user.getProvider()) || !providerId.equals(user.getProviderId())) {
                user.setProvider(provider);
                user.setProviderId(providerId);
            }
            // Only update name and pictureUrl if they are null or empty (i.e., not customized)
            if (user.getName() == null || user.getName().trim().isEmpty()) {
                user.setName(name);
            }
            if (user.getPictureUrl() == null || user.getPictureUrl().trim().isEmpty()) {
                user.setPictureUrl(pictureUrl);
            }
        } else {
            // New user, create with all details
            user = new User(email, name, pictureUrl, provider, providerId);
        }

        // Save the user (new or updated)
        userRepository.save(user);

        // Generate JWT token
        String token = tokenProvider.generateToken(user.getEmail(), user.getId(), user.getName(), user.getPictureUrl());

        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("token", token)
                .build().toUriString();

        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}