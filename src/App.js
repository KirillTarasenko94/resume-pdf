import { useState } from "react";
import { jsPDF } from "jspdf";
import './App.css';
import './i18n';  // Подключаем файл конфигурации i18n
import { useTranslation } from 'react-i18next'; // Импортируем useTranslation

function App() {
  const { t, i18n } = useTranslation();  // Получаем функцию t для перевода
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    skills: "",
    languages: "", // Исправлено на маленькие буквы
    workExperience: [], // Список для опыта работы
    educationList: [],  // Список для образования
    jobTitle: "", // Поля для работы
    companyName: "",
    workPeriod: "",
    experienceDetails: "",
    schoolName: "", // Поля для образования
    degree: "",
    graduationYear: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Переключение языка
  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  // Добавить опыт работы
  const handleAddWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [
        ...formData.workExperience,
        {
          jobTitle: formData.jobTitle,
          companyName: formData.companyName,
          workPeriod: formData.workPeriod,
          experienceDetails: formData.experienceDetails,
        },
      ],
      jobTitle: "", // Очистка полей после добавления
      companyName: "",
      workPeriod: "",
      experienceDetails: "",
    });
  };

  // Удалить опыт работы
  const handleRemoveWorkExperience = (index) => {
    const newWorkExperience = formData.workExperience.filter((_, i) => i !== index);
    setFormData({ ...formData, workExperience: newWorkExperience });
  };

  // Добавить образование
  const handleAddEducation = () => {
    setFormData({
      ...formData,
      educationList: [
        ...formData.educationList,
        {
          schoolName: formData.schoolName,
          degree: formData.degree,
          graduationYear: formData.graduationYear,
        },
      ],
      schoolName: "", // Очистка полей после добавления
      degree: "",
      graduationYear: "",
    });
  };

  // Удалить образование
  const handleRemoveEducation = (index) => {
    const newEducationList = formData.educationList.filter((_, i) => i !== index);
    setFormData({ ...formData, educationList: newEducationList });
  };

  // Генерация PDF
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica");
    doc.setFontSize(14);

    let yPosition = 5;
    const margin = 2;  // Отступы

    // Функция для добавления текста в PDF с меньшими отступами
    const addTextToPDF = (text, fontSize = 12) => {
      doc.setFontSize(fontSize);

      // Проверка, помещается ли текст на странице
      if (yPosition + fontSize > doc.internal.pageSize.height - margin) {
        doc.addPage();
        yPosition = margin;
      }

      doc.text(text, margin, yPosition);
      yPosition += fontSize - 2;  // Уменьшаем отступы между строками
    };

    // Добавление данных с более близкими отступами
    addTextToPDF(formData.name, 14);
    addTextToPDF(formData.address, 10);
    addTextToPDF(formData.email, 10);
    addTextToPDF(formData.phone, 10);
    yPosition += 1; // Немного отступаем от последней строки

    addTextToPDF(t('workExperience'), 14);  // Перевод строки "Work Experience"
    formData.workExperience.forEach((exp) => {
      addTextToPDF(`${t('jobTitle')}: ${exp.jobTitle}`);  // Шаблонная строка
      addTextToPDF(`${t('companyName')}: ${exp.companyName}`);
      addTextToPDF(`${t('workPeriod')}: ${exp.workPeriod}`);
      addTextToPDF(`${t('experienceDetails')}:`, 14);
      const expText = doc.splitTextToSize(exp.experienceDetails, 180);
      expText.forEach(line => addTextToPDF(line, 10));  // Добавляем каждую строку текста
    });

    addTextToPDF(t('skills'), 14);
    const skillsText = doc.splitTextToSize(formData.skills, 180);
    skillsText.forEach(line => addTextToPDF(line));

    addTextToPDF(t('education'), 14);
    formData.educationList.forEach((edu) => {
      addTextToPDF(`${t('schoolName')}: ${edu.schoolName}`);
      addTextToPDF(`${t('degree')}: ${edu.degree}`);
      addTextToPDF(`${t('graduationYear')}: ${edu.graduationYear}`);
      yPosition += 4; // Уменьшаем отступы между записями
    });

    addTextToPDF(t('Choose a language'), 14);
    const languagesText = doc.splitTextToSize(formData.languages, 180);
    languagesText.forEach(line => addTextToPDF(line));

    doc.save("Resume.pdf");
  };

  return (
    <div className="resume-container">
      {/* Селектор для изменения языка */}
      <div>
        <label>{t('chooseLanguage')}:</label>
        <select onChange={(e) => switchLanguage(e.target.value)} defaultValue="en">
          <option value="en">English</option>
          <option value="ru">Русский</option>
          <option value="uk">Українська</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
          <option value="de">Deutsch</option> 
          <option value="zh">中文</option> 
          <option value="pt">Português</option> 
          <option value="ar">العربية</option> 
          <option value="ja">日本語</option> 
          <option value="it">Italiano</option> 
        </select>
      </div>

      <form className="resume-form">
        <label>{t('name')}:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />

        <label>{t('email')}:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />

        <label>{t('phone')}:</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

        <label>{t('address')}:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} />

        <h1>{t('workExperience')}</h1>
        <label>{t('jobTitle')}:</label>
        <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} />

        <label>{t('companyName')}:</label>
        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />

        <label>{t('workPeriod')}:</label>
        <input type="text" name="workPeriod" value={formData.workPeriod} onChange={handleChange} />

        <label>{t('experienceDetails')}:</label>
        <textarea name="experienceDetails" value={formData.experienceDetails} onChange={handleChange} />

        <button type="button" onClick={handleAddWorkExperience}>{t('addWorkExperience')}</button>

        {formData.workExperience.map((exp, index) => (
          <div key={index} className="work-experience">
            <h2>{t('workExperience')} {index + 1}</h2>
            <p><strong>{t('jobTitle')}:</strong> {exp.jobTitle}</p>
            <p><strong>{t('companyName')}:</strong> {exp.companyName}</p>
            <p><strong>{t('workPeriod')}:</strong> {exp.workPeriod}</p>
            <p><strong>{t('experienceDetails')}:</strong> {exp.experienceDetails}</p>
            <button type="button" onClick={() => handleRemoveWorkExperience(index)}>{t('remove')}</button>
          </div>
        ))}

        <h1>{t('education')}</h1>
        <label>{t('schoolName')}:</label>
        <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} />

        <label>{t('degree')}:</label>
        <input type="text" name="degree" value={formData.degree} onChange={handleChange} />

        <label>{t('graduationYear')}:</label>
        <input type="text" name="graduationYear" value={formData.graduationYear} onChange={handleChange} />

        <button type="button" onClick={handleAddEducation}>{t('addEducation')}</button>

        {formData.educationList.map((edu, index) => (
          <div key={index} className="education">
            <h2>{t('education')} {index + 1}</h2>
            <p><strong>{t('schoolName')}:</strong> {edu.schoolName}</p>
            <p><strong>{t('degree')}:</strong> {edu.degree}</p>
            <p><strong>{t('graduationYear')}:</strong> {edu.graduationYear}</p>
            <button type="button" onClick={() => handleRemoveEducation(index)}>{t('remove')}</button>
          </div>
        ))}

        <h1>{t('skills')}</h1>
        <label>{t('skills')}:</label>
        <textarea name="skills" value={formData.skills} onChange={handleChange} />

        <h1>{t('languages')}</h1>
        <label>{t('languages')}:</label>
        <textarea name="languages" value={formData.languages} onChange={handleChange} />

        <button type="button" onClick={handleGeneratePDF}>{t('generatePDF')}</button>
      </form>
    </div>
  );
}

export default App;
