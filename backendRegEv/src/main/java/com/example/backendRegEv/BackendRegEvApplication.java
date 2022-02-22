package com.example.backendRegEv;

import com.example.backendRegEv.enumaration.Status;
import com.example.backendRegEv.model.Server;
import com.example.backendRegEv.repo.ServerRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import static com.example.backendRegEv.enumaration.Status.SERVER_UP;

@SpringBootApplication
public class BackendRegEvApplication {

	public static void main(String[] args) {

		SpringApplication.run(BackendRegEvApplication.class, args);
	}
	@Bean
	CommandLineRunner run(ServerRepo serverRepo) {
		return args -> {
			serverRepo.save(new Server(null, "192.168.1.160", "Ubuntu Linux", "16GB", "Personal PC",
					"https:localhost:8080/server/image/serve1.png", SERVER_UP));
			serverRepo.save(new Server(null, "192.168.1.161", "Mac Linux", "16GB", "Personal PC",
					"https:localhost:8080/server/image/serve2.png", SERVER_UP));
		};
	}

}
