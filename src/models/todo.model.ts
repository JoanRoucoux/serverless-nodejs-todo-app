import { v4 as UUID } from 'uuid';

// Interfaces
interface IProps {
  id?: string;
  name: string;
  completed?: boolean;
}

interface ITodoInterface extends IProps {
  timestamp: number;
}

export default class TodoModel {
  private _id: string;

  private _name: string;

  private _completed: boolean;

  constructor({ id = UUID(), name = '', completed = false }: IProps) {
    this._id = id;
    this._name = name;
    this._completed = completed;
  }

  /**
   * Set Id
   * @param value
   */
  setId(value: string) {
    this._id = value !== '' ? value : null;
  }

  /**
   * Get Id
   * @return {string|*}
   */
  getId(): string {
    return this._id;
  }

  /**
   * Set Name
   * @param value
   */
  setName(value: string) {
    this._name = value !== '' ? value : null;
  }

  /**
   * Get Name
   * @return {string|*}
   */
  getName(): string {
    return this._name;
  }

  /**
   * Set Completed
   * @param value
   */
  setCompleted(value: boolean) {
    this._completed = value || null;
  }

  /**
   * Get Completed
   * @return {boolean}
   */
  getCompleted(): boolean {
    return this._completed;
  }

  /**
   * Get Base entity mappings
   * @return {ITodoInterface}
   */
  getEntityMappings(): ITodoInterface {
    return {
      id: this.getId(),
      name: this.getName(),
      completed: this.getCompleted(),
      timestamp: new Date().getTime(),
    };
  }
}
