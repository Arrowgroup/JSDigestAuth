package pl.arrowgroup.restauth.controllers;

import java.util.Date;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
@RequestMapping("/user")
public class UserController {
	@RequestMapping(value="/echo")
	public @ResponseBody String shopProducts(HttpServletRequest request, HttpServletResponse resp){ 
		return "Hello "+((User) SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUsername()+" - Current Date is : "+new Date() +" - Visit us at : http://arrowgroup.eu";
	}
}
