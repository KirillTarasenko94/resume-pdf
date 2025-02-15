import { useState } from "react";
import { jsPDF } from "jspdf";
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "+353",
    address: "",
    skills: "",
    Languages: "",
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

  // Функция для проверки наличия кириллических символов (русский/украинский текст)
  const containsCyrillic = (text) => {
    const cyrillicRegex = /[А-Яа-яЁёІіЇїЄєҐґ]/;
    return cyrillicRegex.test(text);  // Возвращает true, если есть кириллица
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Проверяем, есть ли кириллица в значении поля
    if (containsCyrillic(value)) {
      alert("Пожалуйста, используйте только английские буквы.");
      return;  // Останавливаем обновление состояния, если есть кириллица
    }

    setFormData({ ...formData, [name]: value });
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

    let yPosition = 5;
    const margin = 10;  // Отступы

    // Функция для добавления текста в PDF с корректными отступами
    const addTextToPDF = (text, fontSize = 12, align = 'left') => {
      doc.setFontSize(fontSize);

      // Проверка, помещается ли текст на странице
      if (yPosition + fontSize > doc.internal.pageSize.height - margin) {
        doc.addPage();
        yPosition = margin;
      }

      const pageWidth = doc.internal.pageSize.width;
      const textWidth = doc.getStringUnitWidth(text) * fontSize / doc.internal.scaleFactor;
      let xPosition;

      // Выравнивание по центру для заголовков и по левому краю для обычного текста
      if (align === 'center') {
        xPosition = (pageWidth - textWidth) / 2; // Выравниваем по центру
      } else {
        xPosition = margin; // По левому краю
      }

      doc.text(text, xPosition, yPosition);
      yPosition += fontSize - 1;  // Увеличиваем отступы между строками
    };

    // Добавление данных с более близкими отступами
    addTextToPDF(formData.name, 14, 'left');
    addTextToPDF(formData.address, 10, 'left');
    addTextToPDF(formData.email, 10, 'left');
    addTextToPDF(formData.phone, 10, 'left');
    yPosition -= 1; // Немного отступаем от последней строки

    doc.setFont("helvetica", "bold");  // Устанавливаем жирный шрифт для заголовков
    addTextToPDF("Work Experience:", 18, 'center');
    doc.setFont("helvetica", "normal");  // Возвращаем нормальный шрифт для остальных данных
    formData.workExperience.forEach((exp) => {
      // Жирный шрифт для Job Title (без самого слова "Job Title:")
      doc.setFont("helvetica", "bold");
      addTextToPDF(exp.jobTitle, 12, 'left');

      // Обычный шрифт для остального текста
      doc.setFont("helvetica", "normal");
      addTextToPDF(`Company: ${exp.companyName}`, 12, 'left');
      addTextToPDF(`Period: ${exp.workPeriod}`, 12, 'left');
      
      // Убираем метку "Experience Details:" и сразу выводим сам опыт
      const expText = doc.splitTextToSize(exp.experienceDetails, 180);
      expText.forEach(line => addTextToPDF(line, 10, 'left')); // Выводим текст опыта без заголовка
    });

    doc.setFont("helvetica", "bold");  // Устанавливаем жирный шрифт для заголовков
    addTextToPDF("Education:", 18, 'center');
    doc.setFont("helvetica", "normal");
    formData.educationList.forEach((edu) => {
      addTextToPDF(`${edu.schoolName}`, 12, 'left');  // Выводим только название школы
      addTextToPDF(`${edu.degree}`, 12, 'left');  // Выводим только степень
      addTextToPDF(`${edu.graduationYear}`, 12, 'left');  // Выводим только год выпуска
      yPosition -= 1; // Уменьшаем отступы между записями
    });

    // Теперь "Skills" идут после "Work Experience" и "Education"
    doc.setFont("helvetica", "bold");
    addTextToPDF("Skills:", 18, 'center');
    doc.setFont("helvetica", "normal");
    const skillsText = doc.splitTextToSize(formData.skills, 180);
    skillsText.forEach(line => addTextToPDF(line, 12, 'left'));
    yPosition -= 10;

    // "Languages" идут в самом конце
    doc.setFont("helvetica", "bold");
    addTextToPDF("Languages:", 18, 'center');
    doc.setFont("helvetica", "normal");
    const languagesText = doc.splitTextToSize(formData.Languages, 180);
    languagesText.forEach(line => addTextToPDF(line, 12, 'left'));

    doc.save("Resume.pdf");
  };

  return (
    <div className="resume-container">
      <form className="resume-form">
        {/* Поля для ввода данных */}
        <label>Name:</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} />

        <label>Email:</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} />

        <label>Phone:</label>
        <input type="text" name="phone" value={formData.phone} onChange={handleChange} />

        <label>Address:</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} />

        <h1>Work Experience</h1>
        <label>Job Title:</label>
        <input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleChange} />

        <label>Company Name:</label>
        <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} />

        <label>Work Period:</label>
        <input type="text" name="workPeriod" value={formData.workPeriod} onChange={handleChange} />

        <label>Experience Details:</label>
        <textarea name="experienceDetails" value={formData.experienceDetails} onChange={handleChange} />

        <button type="button" onClick={handleAddWorkExperience}>Add Work Experience</button>

        {formData.workExperience.map((exp, index) => (
          <div key={index} className="work-experience">
            <h2>Work Experience {index + 1}</h2>
            <p><strong>Job Title:</strong> {exp.jobTitle}</p>
            <p><strong>Company:</strong> {exp.companyName}</p>
            <p><strong>Period:</strong> {exp.workPeriod}</p>
            <p><strong>Experience Details:</strong> {exp.experienceDetails}</p>
            <button type="button" onClick={() => handleRemoveWorkExperience(index)}>Remove</button>
          </div>
        ))}

        <h1>Education</h1>
        <label>School Name:</label>
        <input type="text" name="schoolName" value={formData.schoolName} onChange={handleChange} />

        <label>Degree:</label>
        <input type="text" name="degree" value={formData.degree} onChange={handleChange} />

        <label>Graduation Year:</label>
        <input type="text" name="graduationYear" value={formData.graduationYear} onChange={handleChange} />

        <button type="button" onClick={handleAddEducation}>Add Education</button>

        {formData.educationList.map((edu, index) => (
          <div key={index} className="education">
            <h2>Education {index + 1}</h2>
            <p><strong>School Name:</strong> {edu.schoolName}</p>
            <p><strong>Degree:</strong> {edu.degree}</p>
            <p><strong>Graduation Year:</strong> {edu.graduationYear}</p>
            <button type="button" onClick={() => handleRemoveEducation(index)}>Remove</button>
          </div>
        ))}

        <h1>Skills</h1>
        <label>Skills:</label>
        <textarea name="skills" value={formData.skills} onChange={handleChange} />

        <h1>Languages</h1>
        <label>Languages:</label>
        <textarea name="Languages" value={formData.Languages} onChange={handleChange} />

        <button type="button" onClick={handleGeneratePDF}>Generate PDF</button>
      </form>
    </div>
  );
}

export default App;
