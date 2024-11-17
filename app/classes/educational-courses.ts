import { Db, EducationalCourse, EducationalCourseWithoutId } from "@/app/types";
import { pickRandom } from "@/app/utils";

class EducationalCoursesService {
  constructor(db: Db) {
    this.db = db;
  }

  async findPassedCoursesByLecturerName(
    lecturerName: string
  ): Promise<EducationalCourse[]> {
    const statement = await this.db.prepareAsync(
      `SELECT * FROM educational_courses WHERE lecturerName = $lecturerName AND mark >= 60`
    );

    const result = await statement.executeAsync({
      $lecturerName: lecturerName,
    });

    return (await result.getAllAsync()) as EducationalCourse[];
  }

  async findAll(): Promise<EducationalCourse[]> {
    const result = await this.db.getAllAsync(
      "SELECT * FROM educational_courses"
    );

    return result as EducationalCourse[];
  }

  async getAverageMark(): Promise<number> {
    const result = await this.db.getFirstAsync(
      "SELECT AVG(mark) as averageMark FROM educational_courses"
    );

    return (result as any).averageMark;
  }

  async createCourse(course: EducationalCourseWithoutId) {
    const statement = await this.db.prepareAsync(
      `INSERT INTO educational_courses (name, lecturerName, buildingAddress, mark) VALUES ($name, $lecturerName, $buildingAddress, $mark)`
    );

    await statement.executeAsync({
      $name: course.name,
      $lecturerName: course.lecturerName,
      $buildingAddress: course.buildingAddress,
      $mark: course.mark,
    });
  }

  async initialize() {
    await this.createTable();

    if (await this.areNoCourses()) {
      await this.seedData();
    }
  }

  async reset() {
    await this.dropTable();
    await this.createTable();
    await this.seedData();
  }

  private async areNoCourses(): Promise<boolean> {
    const row = await this.db.getFirstAsync(
      "SELECT 1 FROM educational_courses LIMIT 1"
    );

    return !row;
  }

  private async createTable(): Promise<void> {
    await this.db.execAsync(`
CREATE TABLE IF NOT EXISTS educational_courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  lecturerName TEXT NOT NULL,
  buildingAddress TEXT NOT NULL,
  mark INTEGER NOT NULL
)`);
  }

  private async dropTable(): Promise<void> {
    await this.db.execAsync("DROP TABLE IF EXISTS educational_courses");
  }

  private async seedData(): Promise<void> {
    await Promise.all(
      this.getSeedCourses().map((course) => this.createCourse(course))
    );
  }

  private getSeedCourses(): EducationalCourseWithoutId[] {
    return this.getPossibleCourseNames().map((name) => {
      return {
        name,
        lecturerName: this.getRandomLecturerName(),
        buildingAddress: this.getRandomAddress(),
        mark: this.getRandomMark(),
      };
    });
  }

  private getRandomLecturerName(): string {
    const possibleNames = [
      "Кондратюк Ю.В.",
      "Кнопов П.С.",
      "Савчук М.М.",
      "Слабоспицький О.С.",
      "Шарапов М.М.",
      "Анісімов А.В.",
      "Терещенко В.М.",
      "Заславський В.А.",
      "Глибовець М.М.",
      "Тимашова Л.А.",
      "Панченко Т.В.",
      "Нікітченко М.С.",
      "Дорошенко А.Ю.",
      "Шкільняк С.С.",
      "Зубенко В.В.",
      "Провотар О.І.",
      "Єршов С.В.",
      "Кривий С.Л.",
      "Стецюк П.І.",
      "Верес М.М.",
    ];

    return pickRandom(possibleNames);
  }

  private getRandomMark(): number {
    return Math.floor(Math.random() * 100);
  }

  private getPossibleCourseNames(): string[] {
    const possibleNames = [
      "Математична статистика",
      "Основи дослідження операцій",
      "Дослідження операцій",
      "Архітектура обчислювальних систем та комп'ютерні мережі",
      "Чисельні методи",
      "Теорія програмування",
      "Алгебраїчні структури, криптографія та захист інформації",
      "Обчислювальна геометрія та комп'ютерна графіка",
      "Теорія керування та основи робототехніки",
      "Розподілене та паралельне програмування",
      "Інтелектуальні системи",
      "Основи квантових обчислень",
      "Побудова та аналіз алгоритмів",
      "Основи криптографії",
      "Основи комп'ютерної лінгвістики",
      "Нейронні мережі",
      "Сучасні технології машинного навчання",
      "Системи паралельного програмування",
      "Основи розпізнавання образів",
      "WEB-технології",
      "Методи специфікації та верифікації програм",
      "Парадигми та технології програмування",
      "Інформаційні технології та правовий захист",
    ];

    return possibleNames;
  }

  private getRandomAddress(): string {
    const possibleAddresses = [
      "м. Київ, вул. Володимирська, 60",
      "м. Київ, просп. Академіка Глушкова, 4-Е",
      "м. Київ, вул. Васильківська, 90",
      "м. Київ, просп. Академіка Глушкова, 2",
      "м. Київ, вул. Богдана Гаврилишина, 24",
      "м. Київ, просп. Академіка Глушкова, 4-Д",
      "м. Київ, просп. Академіка Глушкова, 4-Г",
      "м. Київ, вул. Льва Толстого, 14-А",
      "м. Київ, вул. Драгоманова, 3",
      "м. Київ, вул. Мельникова, 36/1",
      "м. Київ, вул. Тарасівська, 16",
      "м. Київ, вул. Васильківська, 36",
      "м. Київ, вул. Симона Петлюри, 36",
    ];

    return pickRandom(possibleAddresses);
  }

  private db: Db;
}

export { EducationalCoursesService };
