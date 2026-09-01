package com.f1nity.library.models.authentication;

public class GoogleLoginRequest {
    private String credential;

    public GoogleLoginRequest() {
    }

    public GoogleLoginRequest(String credential) {
        this.credential = credential;
    }

    public String getCredential() {
        return credential;
    }

    public void setCredential(String credential) {
        this.credential = credential;
    }
}
