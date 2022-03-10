package com.example.backendRegEv.service.implementation;

import com.example.backendRegEv.enumaration.Status;
import com.example.backendRegEv.model.Server;
import com.example.backendRegEv.repo.ServerRepo;
import com.example.backendRegEv.service.ServerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.transaction.Transactional;
import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.Socket;
import java.util.Collection;
import java.util.Random;

import static com.example.backendRegEv.enumaration.Status.SERVER_UP;
import static com.example.backendRegEv.enumaration.Status.SERVER_DOWN;
import static java.lang.Boolean.TRUE;
import static org.springframework.data.domain.PageRequest.of;

@RequiredArgsConstructor
@Service
@Transactional
@Slf4j
public class ServerServiceImpl implements ServerService {
    private final ServerRepo serverRepo;

    @Override
    public Server create(Server server) {
        log.info("Saving new server: {}", server.getName());
        server.setImageUrl(setServerImageUrl());
        return serverRepo.save(server);
    }

    @Override
    public Server ping(String ipAddress) throws IOException {
        log.info("Pinging server: {}", ipAddress);
        Server server =serverRepo.findByIpAddress(ipAddress);
        InetAddress address=InetAddress.getByName(ipAddress);
        server.setStatus(address.isReachable(10000) ? SERVER_UP : SERVER_DOWN);
        serverRepo.save(server);
        return server;
    }

    @Override
    public Collection<Server> list(int limit) {
        log.info("Trayendo los servidores");
        return serverRepo.findAll(of(0,limit)).toList();
    }

    @Override
    public Server get(Long id) {
        log.info("Trayendo los servidores por Ids: {}", id);
        return serverRepo.findById(id).get();
    }

    @Override
    public Server update(Server server) {
        log.info("Updating server: {}", server.getName());
        return serverRepo.save(server);
    }

    @Override
    public Boolean delete(Long id) {
        log.info("Deleting server by ID: {}", id);
        serverRepo.deleteById(id);
        return TRUE;
    }
    private String setServerImageUrl() {
        String[] imageNames = {"bd1.png", "bd2.png", "bd3.png", "bd4.png"};
        return ServletUriComponentsBuilder.fromCurrentContextPath().path("server/image" + imageNames[new Random().nextInt(4)]).toUriString();
    }

    private boolean isReachable(String ipAddress, int port, int timeOut) {
        try {
            try(Socket socket = new Socket()) {
                socket.connect(new InetSocketAddress(ipAddress, port), timeOut);
            }
            return true;
        }catch (IOException exception){
            return false;
        }
    }
}
