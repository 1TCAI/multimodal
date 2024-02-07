package com.eegnet.framework.config;

import com.dingxianginc.ctu.client.CaptchaClient;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * @author baiyu on 19/6/3.
 * @export
 */
@Configuration
@ConfigurationProperties(prefix = "dx")
public class DxConfig {

	@Bean
	public CaptchaClient captchaClient() {
		return new CaptchaClient(appId, appSecret);
	}

	public String appId;

	public String appSecret;

	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public String getAppSecret() {
		return appSecret;
	}

	public void setAppSecret(String appSecret) {
		this.appSecret = appSecret;
	}

}