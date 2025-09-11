package com.example.cloud.security;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.math.BigInteger;
import java.net.URL;
import java.security.KeyFactory;
import java.security.PublicKey;
import java.security.spec.RSAPublicKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Component
public class ClerkJwksProvider {

    @Value("${clerk.jwks.url}")
    private  String jwksUrl;

    private final Map<String, PublicKey> keyCache=new HashMap<>();
    private  long lastFetchedTime = 0;
    private  static  final  long CACHE_TTL=36000000;


    public PublicKey getPublicKey(String keyId)  throws  Exception{
       if(keyCache.containsKey(keyId) && System.currentTimeMillis() - lastFetchedTime < CACHE_TTL) {
           return keyCache.get(keyId);
       }

       refreshKeys();
       return  keyCache.get(keyId);
    }

    private void refreshKeys() throws  Exception {

        ObjectMapper mapper=new ObjectMapper();
        JsonNode jwks=mapper.readTree(new URL(jwksUrl));
        JsonNode keys = jwks.get("keys");
        for (JsonNode keyNode : keys) {
            String keyId = keyNode.get("kid").asText();
            String keytype = keyNode.get("kty").asText();
            String alg= keyNode.get("alg").asText();

            if("RSA".equals(keytype) && "RS256".equals(alg)) {
                String n = keyNode.get("n").asText();
                String e = keyNode.get("e").asText();
               PublicKey publicKey =createPublicKey( n, e);
                keyCache.put(keyId, publicKey);
            }


        }
        lastFetchedTime = System.currentTimeMillis();

    }

    private PublicKey createPublicKey(String n, String e)  throws  Exception{

       byte[] modulusBytes=Base64.getUrlDecoder().decode(n);
        byte[]  exponentBytes=Base64.getUrlDecoder().decode(e);

        BigInteger modulusBigInt = new BigInteger(1, modulusBytes);
        BigInteger exponentBigInt = new BigInteger(1, exponentBytes);

        RSAPublicKeySpec spec=new RSAPublicKeySpec(modulusBigInt,exponentBigInt);
        KeyFactory factory=KeyFactory.getInstance("RSA");
        return factory.generatePublic(spec);

    }


}


