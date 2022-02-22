package com.example.backendRegEv.repo;

import com.example.backendRegEv.model.Server;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServerRepo extends JpaRepository <Server, Long>{
    Server findByIpAddress(String ipAddress);
}
