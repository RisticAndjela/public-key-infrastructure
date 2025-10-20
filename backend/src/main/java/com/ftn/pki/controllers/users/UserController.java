package com.ftn.pki.controllers.users;

import com.ftn.pki.dto.users.CreateCAUserDTO;
import com.ftn.pki.services.users.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/create-ca")
    public ResponseEntity<String> createCAUser(@RequestBody CreateCAUserDTO dto) {
        userService.createCAUser(dto);
        return ResponseEntity.ok().build();
    }
}
