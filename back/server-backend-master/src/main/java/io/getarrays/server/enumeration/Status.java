package io.getarrays.server.enumeration;

/**
 Aqui Se crean los estados de los servidores, despues se puede quitar debido a que mi desarrollo no tiene esta seccion.
 */
public enum Status {
    SERVER_UP("SERVER_UP"),
    SERVER_DOWN("SERVER_DOWN");

    private final String status;

    Status(String status) {
        this.status = status;
    }

    public String getStatus() {
        return this.status;
    }
}
