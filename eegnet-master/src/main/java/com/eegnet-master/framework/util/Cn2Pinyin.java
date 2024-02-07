package com.eegnet.framework.util;

import net.sourceforge.pinyin4j.PinyinHelper;
import net.sourceforge.pinyin4j.format.HanyuPinyinCaseType;
import net.sourceforge.pinyin4j.format.HanyuPinyinOutputFormat;
import net.sourceforge.pinyin4j.format.HanyuPinyinToneType;
import net.sourceforge.pinyin4j.format.exception.BadHanyuPinyinOutputFormatCombination;

/**
 * @author wangyujie
 * @date 2018/12/28
 */
public class Cn2Pinyin {

    /**
     * This 汉字转换为汉语拼音
     * @param chineseCharacters
     * @param acronymy true:只要汉语拼音首字母 false:转换全部
     * @return
     */
    public static String convert(String chineseCharacters, boolean acronymy) {
        String pinyinName = "";
        char[] nameChar = chineseCharacters.toCharArray();
        HanyuPinyinOutputFormat defaultFormat = new HanyuPinyinOutputFormat();
        defaultFormat.setCaseType(HanyuPinyinCaseType.LOWERCASE);
        defaultFormat.setToneType(HanyuPinyinToneType.WITHOUT_TONE);
        for (char element : nameChar) {
            if (element > 128 && element != '（' && element != '）') {
                try {
                    if (acronymy) {
                        pinyinName += PinyinHelper.toHanyuPinyinStringArray(element, defaultFormat)[0].charAt(0);
                    } else {
                        pinyinName += PinyinHelper.toHanyuPinyinStringArray(element, defaultFormat)[0];
                    }
                } catch (BadHanyuPinyinOutputFormatCombination e) {
                    e.printStackTrace();
                } catch (Exception e) {
                    // 难免有不认识的字
                    e.printStackTrace();
                    System.out.println("element=" + element);
                }
            } else {
                pinyinName += element;
            }
        }
        return pinyinName;
    }
}
