package fr.viethan.backend.entities.enums;

public enum Role {
    USER,
    ADMIN;

    public String getRoleName() {
        return this.name().toLowerCase();
    }
}
