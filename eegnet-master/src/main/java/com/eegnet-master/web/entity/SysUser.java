spackage com.pandabus.web.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

/**
 * @author baiyu on 18/12/12.
 * @export
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SysUser implements Serializable {

	String userId;
	String username;
	String password;
	String salt;
	Integer status;
	Integer roleId;
	String roleName;
	String createDate;
	String updateDate;

	Integer companyId;
	String companyName;

}