package com.eegnet;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * @author baiyu on 18/12/11.
 * @export
 */
@SpringBootApplication
@EnableTransactionManagement
@EnableScheduling
@MapperScan(basePackages = "com.eegnet.web.dao")
public class eegnetEEGWebStartup {

    public static void main(String[] args) {
        SpringApplication.run(eegnetEEGWebStartup.class, args);
    }

}