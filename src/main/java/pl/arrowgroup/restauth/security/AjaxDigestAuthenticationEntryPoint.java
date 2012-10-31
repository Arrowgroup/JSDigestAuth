package pl.arrowgroup.restauth.security;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.www.DigestAuthenticationEntryPoint;

public class AjaxDigestAuthenticationEntryPoint extends DigestAuthenticationEntryPoint{

	@Override
	public void commence(HttpServletRequest request,
			HttpServletResponse response, AuthenticationException authException)
			throws IOException, ServletException {
		super.commence(request, new UnauthorizedHttpResponse(response), authException);
	}
	private static class UnauthorizedHttpResponse extends HttpServletResponseWrapper{
		public UnauthorizedHttpResponse(HttpServletResponse response) {
			super(response);
		}
		@Override
		public void sendError(int sc, String msg) throws IOException {
			if(sc == HttpServletResponse.SC_UNAUTHORIZED){
				sc = HttpServletResponse.SC_FORBIDDEN;
			}
			super.sendError(sc, msg);
		}
		
	}
}
