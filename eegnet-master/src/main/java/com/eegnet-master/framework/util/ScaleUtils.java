package com.eegnet.framework.util;

import com.eegnet.web.entity.Scale;

/**
 * @Description
 * @Author sun
 * @Date 2019/3/29 10:42
 * @Version 1.0
 */
public class ScaleUtils {

    public static Scale setScale(String[] dataGroup, String ScaleType) {
        Scale scale = new Scale();
        int dataLength = dataGroup.length;
        if (dataLength > 0) {
            scale.setPatientNumber(dataGroup[0]);
            scale.setScaleType(ScaleType);
        } else {
            return scale;
        }
        if (dataLength > 1) {
            scale.setHospitalNumber(dataGroup[1]);
        } else {
            return scale;
        }
        if (dataLength > 2) {
            scale.setRowDate(dataGroup[2]);
        } else {
            return scale;
        }
        if (dataLength > 3) {
            scale.setFiled1(dataGroup[3]);
        } else {
            return scale;
        }
        if (dataLength > 4) {
            scale.setFiled2(dataGroup[4]);
        } else {
            return scale;
        }
        if (dataLength > 5) {
            scale.setFiled3(dataGroup[5]);
        } else {
            return scale;
        }
        if (dataLength > 6) {
            scale.setFiled4(dataGroup[6]);
        } else {
            return scale;
        }
        if (dataLength > 7) {
            scale.setFiled5(dataGroup[7]);
        } else {
            return scale;
        }
        if (dataLength > 8) {
            scale.setFiled6(dataGroup[8]);
        } else {
            return scale;
        }
        if (dataLength > 9) {
            scale.setFiled7(dataGroup[9]);
        } else {
            return scale;
        }
        if (dataLength > 10) {
            scale.setFiled8(dataGroup[10]);
        } else {
            return scale;
        }
        if (dataLength > 11) {
            scale.setFiled9(dataGroup[11]);
        } else {
            return scale;
        }
        if (dataLength > 12) {
            scale.setFiled10(dataGroup[12]);
        } else {
            return scale;
        }
        if (dataLength > 13) {
            scale.setFiled11(dataGroup[13]);
        } else {
            return scale;
        }
        if (dataLength > 14) {
            scale.setFiled12(dataGroup[14]);
        } else {
            return scale;
        }
        if (dataLength > 15) {
            scale.setFiled13(dataGroup[15]);
        } else {
            return scale;
        }
        if (dataLength > 16) {
            scale.setFiled14(dataGroup[16]);
        } else {
            return scale;
        }
        if (dataLength > 17) {
            scale.setFiled15(dataGroup[17]);
        } else {
            return scale;
        }
        if (dataLength > 18) {
            scale.setFiled16(dataGroup[18]);
        } else {
            return scale;
        }
        if (dataLength > 19) {
            scale.setFiled17(dataGroup[19]);
        } else {
            return scale;
        }
        if (dataLength > 20) {
            scale.setFiled18(dataGroup[20]);
        } else {
            return scale;
        }
        if (dataLength > 21) {
            scale.setFiled19(dataGroup[21]);
        } else {
            return scale;
        }
        if (dataLength > 22) {
            scale.setFiled20(dataGroup[22]);
        } else {
            return scale;
        }
        if (dataLength > 23) {
            scale.setFiled21(dataGroup[23]);
        } else {
            return scale;
        }
        if (dataLength > 24) {
            scale.setFiled22(dataGroup[24]);
        } else {
            return scale;
        }
        if (dataLength > 25) {
            scale.setFiled23(dataGroup[25]);
        } else {
            return scale;
        }
        if (dataLength > 26) {
            scale.setFiled24(dataGroup[26]);
        } else {
            return scale;
        }
        if (dataLength > 27) {
            scale.setFiled25(dataGroup[27]);
        } else {
            return scale;
        }
        if (dataLength > 28) {
            scale.setFiled26(dataGroup[28]);
        } else {
            return scale;
        }
        if (dataLength > 29) {
            scale.setFiled27(dataGroup[29]);
        } else {
            return scale;
        }
        if (dataLength > 30) {
            scale.setFiled28(dataGroup[30]);
        } else {
            return scale;
        }
        if (dataLength > 31) {
            scale.setFiled29(dataGroup[31]);
        } else {
            return scale;
        }
        if (dataLength > 32) {
            scale.setFiled30(dataGroup[32]);
        } else {
            return scale;
        }
        return scale;
    }
}
