package com.example.backendRegEv.model;

import com.example.backendRegEv.enumaration.Status;
import jdk.jshell.Snippet;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;

import static javax.persistence.GenerationType.AUTO;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor


public class Server {
    @Id @GeneratedValue(strategy = AUTO)
    private Long id;
    @Column(unique = true)
    @NotEmpty(message = "IP no puede estar vacia")
    private String ipAddress;
    private String name;
    private String type;
    private String memory;
    private String imageUrl;
    private Status status;
}
