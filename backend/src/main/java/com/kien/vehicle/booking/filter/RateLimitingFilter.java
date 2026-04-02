package com.kien.vehicle.booking.filter;

import io.github.bucket4j.Bucket;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final Bucket loginBucket;
    private final Bucket registerBucket;

    public RateLimitingFilter(
            @Qualifier("loginBucket") Bucket loginBucket,
            @Qualifier("registerBucket") Bucket registerBucket) {
        this.loginBucket = loginBucket;
        this.registerBucket = registerBucket;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String path = request.getRequestURI();

        Bucket bucket = null;
        if (path.contains("/api/auth/login")) {
            bucket = loginBucket;
        } else if (path.contains("/api/auth/register")) {
            bucket = registerBucket;
        }

        if (bucket != null) {
            if (bucket.tryConsume(1)) {
                filterChain.doFilter(request, response);
            } else {
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                response.getWriter().write("{\"success\":false,\"message\":\"Quá nhiều yêu cầu. Vui lòng thử lại sau 1 phút.\"}");
                return;
            }
        } else {
            filterChain.doFilter(request, response);
        }
    }
}