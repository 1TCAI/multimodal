package com.eegnet.framework.redis;

import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import redis.clients.jedis.*;
import redis.clients.jedis.params.geo.GeoRadiusParam;

import java.util.*;

/**
 * Created by fengjc on 14/12/16
 */
public class RedisClient extends JedisPool {

	public RedisClient(GenericObjectPoolConfig poolConfig, String host, int port, String password) {
		super(poolConfig, host, port, Protocol.DEFAULT_TIMEOUT, password);
	}

	public Set<String> keys(final String pattern) {
		return new Executor<Set<String>>(this) {
			@Override
			Set<String> execute() {
				return jedis.keys("*" + pattern + "*");
			}
		}.getResult();
	}

	public Map<String, String> listMapValues(List<String> keys) {
		return new Executor<Map<String, String>>(this) {
			@Override
			Map<String, String> execute() {
				Map<String, Response<String>> responses = new HashMap<>();
				Pipeline pipeline = jedis.pipelined();
				for (String key : keys) {
					responses.put(key, pipeline.get(key));
				}
				pipeline.sync();
				Map<String, String> values = new HashMap<>();
				for (String key : responses.keySet()) {
					values.put(key, responses.get(key).get());
				}
				return values;
			}
		}.getResult();
	}

	public List<String> listByPrefix(final String pattern) {
		return new Executor<List<String>>(this) {
			@Override
			List<String> execute() {
				Set<String> keys = jedis.keys(pattern + "*");
				int size = keys.size();
				List<Response<String>> responses = new ArrayList<>(size);
				Pipeline pipeline = jedis.pipelined();
				for (String key : keys) {
					responses.add(pipeline.get(key));
				}
				pipeline.sync();
				List<String> values = new ArrayList<>(size);
 				for (Response<String> res : responses) {
				    values.add(res.get());
				}
				return values;
			}
		}.getResult();
	}

	public Map<String, String> mapByPrefix(final String pattern) {
		return new Executor<Map<String, String>>(this) {
			@Override
			Map<String, String> execute() {
				Set<String> keys = jedis.keys(pattern + "*");
				int size = keys.size();
				Map<String, Response<String>> responses = new HashMap<>(size);
				Pipeline pipeline = jedis.pipelined();
				for (String key : keys) {
					responses.put(key, pipeline.get(key));
				}
				pipeline.sync();
				Map<String, String> values = new HashMap<>(size);
				for (Map.Entry<String, Response<String>> m : responses.entrySet()) {
					values.put(m.getKey(), m.getValue().get());
				}
				return values;
			}
		}.getResult();
	}

    public Long hdel(final String key, final String field) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				return jedis.hdel(key, field);
			}
		}.getResult();
	}

    public Long hdel(final String key) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				return jedis.hdel(key);
			}
		}.getResult();
	}

	public Long del(final String key) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				return jedis.del(key);
			}
		}.getResult();
	}

	public Long del(final String... keys) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				return jedis.del(keys);
			}
		}.getResult();
	}

	public String hget(final String key, final String field) {
		return new Executor<String>(this) {
			@Override
			String execute() {
				return jedis.hget(key, field);
			}
		}.getResult();
	}

	public Map<String, String> hgetAll(final String key) {
		return new Executor<Map<String, String>>(this) {
			@Override
			Map<String, String> execute() {
				return jedis.hgetAll(key);
			}
		}.getResult();
	}

	public String hmset(final String key, final Map<String, String> hash) {
		return new Executor<String>(this) {
			@Override
			String execute() {
				return jedis.hmset(key, hash);
			}
		}.getResult();
	}

	public String hmset(final String key, final Map<String, String> hash, long expireMilli) {
		return new Executor<String>(this) {
			@Override
			String execute() {
				Pipeline pipeline = jedis.pipelined();
				pipeline.hmset(key, hash);
				pipeline.pexpire(key, expireMilli);
				pipeline.sync();
				return key;
			}
		}.getResult();
	}

	public String set(final String key, final String value) {
		return new Executor<String>(this) {
			@Override
			String execute() {
				String rtn = jedis.set(key, value);
				return rtn;
			}
		}.getResult();
	}

	public String set(final String key, final String value, int expireSeconds) {
		return new Executor<String>(this) {
			@Override
			String execute() {
				Pipeline pipeline = jedis.pipelined();
				pipeline.set(key, value);
				pipeline.expire(key, expireSeconds);
				pipeline.sync();
				return value;
			}
		}.getResult();
	}

	public Set<String> set(final Map<String, String> keyValues, long expireMilli) {
		return new Executor<Set<String>>(this) {
			@Override
			Set<String> execute() {
				Pipeline pipeline = jedis.pipelined();
				Set<String> result = new HashSet<>();
				for (Map.Entry<String, String> entry : keyValues.entrySet()) {
					pipeline.set(entry.getKey(), entry.getValue());
					pipeline.pexpire(entry.getKey(), expireMilli);
					result.add(entry.getKey());
				}
				pipeline.sync();
				return result;
			}
		}.getResult();
	}

	public Long hset(final String key, final String field, final String value) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				return jedis.hset(key, field, value);
			}
		}.getResult();
	}

	public Long hset(final String key, final String field, final String value, long expireMilli) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				Pipeline pipeline = jedis.pipelined();
				long l = jedis.hset(key, field, value);
				pipeline.pexpire(key, expireMilli);
				pipeline.sync();
				return l;
			}
		}.getResult();
	}

	public String get(final String key) {
		return new Executor<String>(this) {
			@Override
			String execute() {
				return jedis.get(key);
			}
		}.getResult();
	}

	public Boolean exists(final String key) {
		return new Executor<Boolean>(this) {
			@Override
			Boolean execute() {
				return jedis.exists(key);
			}
		}.getResult();
	}

	public List<String> get(final Set<String> keys) {
		return new Executor<List<String>>(this) {
			@Override
			List<String> execute() {
				final List<String> list = new ArrayList<>(keys.size());
				final List<Response<String>> responses = new ArrayList<>(keys.size());
				Pipeline pipeline = jedis.pipelined();
				for (String key : keys) {
					responses.add(pipeline.get(key));
				}
				pipeline.sync();
				for (Response<String> response : responses) {
					list.add(response.get());
				}
				return list;
			}
		}.getResult();
	}

	/**
	 * 下标(index)参数 start 和 stop 都以 0 为底，也就是说，以 0 表示列表的第一个元素，以 1 表示列表的第二个元素，以此类推。
	 * 你也可以使用负数下标，以 -1 表示列表的最后一个元素， -2 表示列表的倒数第二个元素，以此类推。
	 *
	 * @param key
	 * @param start
	 * @param end
	 * @return
	 */
	public List<String> lrange(String key, int start, int end) {
		return new Executor<List<String>>(this) {
			@Override
			List<String> execute() {
				return jedis.lrange(key, start, end);
			}
		}.getResult();
	}

	public Long rpush(String key, String value, int seconds) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				Pipeline pipeline = jedis.pipelined();
				long l = jedis.lpush(key, value);
				jedis.expire(key, seconds);
				pipeline.sync();
				return l;
			}
		}.getResult();
	}

	public Long rpush(String key, String... values) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				return jedis.rpush(key, values);
			}
		}.getResult();
	}

	public Long lpush(String key, String... values) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				Pipeline pipeline = jedis.pipelined();
				long l = jedis.lpush(key, values);
				pipeline.sync();
				return l;
			}
		}.getResult();
	}

	public Long lpush(String key, int seconds, String... values) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				Pipeline pipeline = jedis.pipelined();
				long l = jedis.lpush(key, values);
				jedis.expire(key, seconds);
				pipeline.sync();
				return l;
			}
		}.getResult();
	}

	public String ltrim(String key, int start, int end) {
		return new Executor<String>(this) {
			@Override
			String execute() {
				return jedis.ltrim(key, start, end);
			}
		}.getResult();
	}

	public Long lrem(String key, int count, String value) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				return jedis.lrem(key, count, value);
			}
		}.getResult();
	}

	public void rpop(String key, int len) {
		if (key == null)
			return;
		new Executor<Void>(this) {
			@Override
			Void execute() {
				Pipeline pipeline = jedis.pipelined();
				for (int i = 0; i < len; i++) {
					jedis.rpop(key);
				}
				pipeline.sync();
				return null;
			}
		}.getResult();
	}

	public String lpop(String key) {
		return new Executor<String>(this) {
			@Override
			String execute() {
				return jedis.lpop(key);
			}
		}.getResult();
	}

	public Long llen(String key) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				return jedis.llen(key);
			}
		}.getResult();
	}

	public Long setnx(String key, String value) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				return jedis.setnx(key, value);
			}
		}.getResult();
	}

	public Long setnx(String key, String value, Integer seconds) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				Long l = jedis.setnx(key, value);
				jedis.expire(key, seconds);
				return l;
			}
		}.getResult();
	}

	public Long expire(String key, int seconds) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				return jedis.expire(key, seconds);
			}
		}.getResult();
	}

	/********* set ***********/
	public Set<String> smembers(String key) {
		return new Executor<Set<String>>(this) {
			@Override
			Set<String> execute() {
				return jedis.smembers(key);
			}
		}.getResult();
	}

	public Long sadd(String key, int seconds, String... values) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				Pipeline pipeline = jedis.pipelined();
				long l = jedis.sadd(key, values);
				jedis.expire(key, seconds);
				pipeline.sync();
				return l;
			}
		}.getResult();
	}

	public Long srem(String key, String... values) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				return jedis.srem(key, values);
			}
		}.getResult();
	}

	public Long scard(String key) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				return jedis.scard(key);
			}
		}.getResult();
	}

	/***** geo ******/
	public Long geoadd(String key, double lng, double lat, String member) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				return jedis.geoadd(key, lng, lat, member);
			}
		}.getResult();
	}

	public Long geoadd(String key, double lng, double lat, String member, int seconds) {
		return new Executor<Long>(this) {
			@Override
			Long execute() {
				Pipeline pipeline = jedis.pipelined();
				long l = jedis.geoadd(key, lng, lat, member);
				jedis.expire(key, seconds);
				pipeline.sync();
				return l;
			}
		}.getResult();
	}

	public List<GeoRadiusResponse> georadius(String key, double lng, double lat, double radius) {
		return georadius(key, lng, lat, radius, GeoUnit.M, GeoRadiusParam.geoRadiusParam().sortAscending().withCoord().withDist());
	}

	public List<GeoRadiusResponse> georadius(String key, double lng, double lat, double radius, GeoUnit geoUnit, GeoRadiusParam param) {
		return new Executor<List<GeoRadiusResponse>>(this) {
			@Override
			List<GeoRadiusResponse> execute() {
				return jedis.georadius(key, lng, lat, radius, geoUnit, param);
			}
		}.getResult();
	}

	private abstract class Executor<T> {

		public Jedis jedis;

		public Executor(JedisPool pool) {
			this.jedis = pool.getResource();
		}

		abstract T execute();

		T getResult() {
			T result = null;
			try {
				result = execute();
			} catch (Throwable e) {
				e.printStackTrace();
			} finally {
				if (jedis != null) {
					jedis.close();
				}
			}
			return result;
		}
	}

}